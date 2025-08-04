import React, { useState } from 'react';

// Types for grid and steps
interface AnnealStep {
  current: { x: number; y: number };
  neighbor: { x: number; y: number };
  temperature: number;
  accepted: boolean;
  path: Array<{ x: number; y: number }>;
  cost: number;
  neighborCost: number;
  prob: number;
  isGoal: boolean;
}

const gridSize = 8;
const cellSize = 40;
const goal = { x: 6, y: 6 };
const start = { x: 1, y: 1 };

// Manhattan distance as heuristic
function heuristic(x: number, y: number) {
  return Math.abs(goal.x - x) + Math.abs(goal.y - y);
}

// Obstacles
const isObstacle = (x: number, y: number) =>
  (x === 3 && y >= 2 && y <= 5) ||
  (x === 5 && y >= 1 && y <= 4) ||
  (x === 2 && y === 4);

// Generate grid
const annealGrid: { x: number; y: number; isObstacle: boolean; h: number }[][] = [];
for (let y = 0; y < gridSize; y++) {
  const row = [];
  for (let x = 0; x < gridSize; x++) {
    row.push({ x, y, isObstacle: isObstacle(x, y), h: heuristic(x, y) });
  }
  annealGrid.push(row);
}

// Precomputed steps for demo (shows escaping local maxima)
const annealSteps: AnnealStep[] = [
  {
    current: { x: 1, y: 1 },
    neighbor: { x: 2, y: 1 },
    temperature: 5.0,
    accepted: true,
    path: [{ x: 1, y: 1 }],
    cost: heuristic(1, 1),
    neighborCost: heuristic(2, 1),
    prob: 1,
    isGoal: false,
  },
  {
    current: { x: 2, y: 1 },
    neighbor: { x: 3, y: 1 },
    temperature: 4.5,
    accepted: true,
    path: [{ x: 2, y: 1 }, { x: 1, y: 1 }],
    cost: heuristic(2, 1),
    neighborCost: heuristic(3, 1),
    prob: 1,
    isGoal: false,
  },
  {
    current: { x: 3, y: 1 },
    neighbor: { x: 4, y: 1 },
    temperature: 4.0,
    accepted: true,
    path: [{ x: 3, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 1 }],
    cost: heuristic(3, 1),
    neighborCost: heuristic(4, 1),
    prob: 1,
    isGoal: false,
  },
  {
    current: { x: 4, y: 1 },
    neighbor: { x: 4, y: 2 },
    temperature: 3.5,
    accepted: true,
    path: [{ x: 4, y: 1 }, { x: 3, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 1 }],
    cost: heuristic(4, 1),
    neighborCost: heuristic(4, 2),
    prob: 1,
    isGoal: false,
  },
  // At local maximum (4,2), try to move to (3,2) which is worse, but may be accepted
  {
    current: { x: 4, y: 2 },
    neighbor: { x: 3, y: 2 },
    temperature: 3.0,
    accepted: true, // accepted due to probability
    path: [{ x: 4, y: 2 }, { x: 4, y: 1 }, { x: 3, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 1 }],
    cost: heuristic(4, 2),
    neighborCost: heuristic(3, 2),
    prob: 0.6,
    isGoal: false,
  },
  // Now try to move to (3,3) which is better
  {
    current: { x: 3, y: 2 },
    neighbor: { x: 3, y: 3 },
    temperature: 2.5,
    accepted: true,
    path: [{ x: 3, y: 2 }, { x: 4, y: 2 }, { x: 4, y: 1 }, { x: 3, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 1 }],
    cost: heuristic(3, 2),
    neighborCost: heuristic(3, 3),
    prob: 1,
    isGoal: false,
  },
  // Move to (3,4)
  {
    current: { x: 3, y: 3 },
    neighbor: { x: 3, y: 4 },
    temperature: 2.0,
    accepted: true,
    path: [{ x: 3, y: 3 }, { x: 3, y: 2 }, { x: 4, y: 2 }, { x: 4, y: 1 }, { x: 3, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 1 }],
    cost: heuristic(3, 3),
    neighborCost: heuristic(3, 4),
    prob: 1,
    isGoal: false,
  },
  // Move to (3,5)
  {
    current: { x: 3, y: 4 },
    neighbor: { x: 3, y: 5 },
    temperature: 1.5,
    accepted: true,
    path: [{ x: 3, y: 4 }, { x: 3, y: 3 }, { x: 3, y: 2 }, { x: 4, y: 2 }, { x: 4, y: 1 }, { x: 3, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 1 }],
    cost: heuristic(3, 4),
    neighborCost: heuristic(3, 5),
    prob: 1,
    isGoal: false,
  },
  // Move to (2,5)
  {
    current: { x: 3, y: 5 },
    neighbor: { x: 2, y: 5 },
    temperature: 1.0,
    accepted: true,
    path: [{ x: 3, y: 5 }, { x: 3, y: 4 }, { x: 3, y: 3 }, { x: 3, y: 2 }, { x: 4, y: 2 }, { x: 4, y: 1 }, { x: 3, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 1 }],
    cost: heuristic(3, 5),
    neighborCost: heuristic(2, 5),
    prob: 1,
    isGoal: false,
  },
  // Move to (2,6)
  {
    current: { x: 2, y: 5 },
    neighbor: { x: 2, y: 6 },
    temperature: 0.7,
    accepted: true,
    path: [{ x: 2, y: 5 }, { x: 3, y: 5 }, { x: 3, y: 4 }, { x: 3, y: 3 }, { x: 3, y: 2 }, { x: 4, y: 2 }, { x: 4, y: 1 }, { x: 3, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 1 }],
    cost: heuristic(2, 5),
    neighborCost: heuristic(2, 6),
    prob: 1,
    isGoal: false,
  },
  // Move to (3,6)
  {
    current: { x: 2, y: 6 },
    neighbor: { x: 3, y: 6 },
    temperature: 0.5,
    accepted: true,
    path: [{ x: 2, y: 6 }, { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 3, y: 4 }, { x: 3, y: 3 }, { x: 3, y: 2 }, { x: 4, y: 2 }, { x: 4, y: 1 }, { x: 3, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 1 }],
    cost: heuristic(2, 6),
    neighborCost: heuristic(3, 6),
    prob: 1,
    isGoal: false,
  },
  // Move to (4,6)
  {
    current: { x: 3, y: 6 },
    neighbor: { x: 4, y: 6 },
    temperature: 0.3,
    accepted: true,
    path: [{ x: 3, y: 6 }, { x: 2, y: 6 }, { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 3, y: 4 }, { x: 3, y: 3 }, { x: 3, y: 2 }, { x: 4, y: 2 }, { x: 4, y: 1 }, { x: 3, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 1 }],
    cost: heuristic(3, 6),
    neighborCost: heuristic(4, 6),
    prob: 1,
    isGoal: false,
  },
  // Move to (5,6)
  {
    current: { x: 4, y: 6 },
    neighbor: { x: 5, y: 6 },
    temperature: 0.2,
    accepted: true,
    path: [{ x: 4, y: 6 }, { x: 3, y: 6 }, { x: 2, y: 6 }, { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 3, y: 4 }, { x: 3, y: 3 }, { x: 3, y: 2 }, { x: 4, y: 2 }, { x: 4, y: 1 }, { x: 3, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 1 }],
    cost: heuristic(4, 6),
    neighborCost: heuristic(5, 6),
    prob: 1,
    isGoal: false,
  },
  // Move to (6,6) - goal
  {
    current: { x: 5, y: 6 },
    neighbor: { x: 6, y: 6 },
    temperature: 0.1,
    accepted: true,
    path: [{ x: 5, y: 6 }, { x: 4, y: 6 }, { x: 3, y: 6 }, { x: 2, y: 6 }, { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 3, y: 4 }, { x: 3, y: 3 }, { x: 3, y: 2 }, { x: 4, y: 2 }, { x: 4, y: 1 }, { x: 3, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 1 }],
    cost: heuristic(5, 6),
    neighborCost: heuristic(6, 6),
    prob: 1,
    isGoal: true,
  },
];

const SimulatedAnnealingVisualization: React.FC = () => {
  const [step, setStep] = useState(0);
  const totalSteps = annealSteps.length;
  const current = annealSteps[step];

  // Cell coloring
  function getCellColor(x: number, y: number): string {
    if (x === start.x && y === start.y) return '#4dabf7'; // Start
    if (x === goal.x && y === goal.y) return '#ff922b'; // Goal
    if (annealGrid[y][x].isObstacle) return '#343a40'; // Obstacle
    if (x === current.current.x && y === current.current.y) return '#ff6b6b'; // Current
    if (x === current.neighbor.x && y === current.neighbor.y) {
      return current.accepted ? '#51cf66' : '#fab005'; // Accepted neighbor: green, else yellow
    }
    if (current.path.some(cell => cell.x === x && cell.y === y)) return '#da77f2'; // Path
    return '#f8f9fa'; // Default
  }

  // Step explanation
  function getStepDescription(s: AnnealStep): string {
    if (s.isGoal) {
      return `Reached the goal!`;
    }
    if (s.accepted) {
      if (s.neighborCost < s.cost) {
        return `Moved to a better neighbor (${s.neighbor.x},${s.neighbor.y}) with lower cost (${s.neighborCost}).`;
      } else {
        return `Moved to a worse neighbor (${s.neighbor.x},${s.neighbor.y}) with higher cost (${s.neighborCost}) due to probability (${(s.prob * 100).toFixed(0)}%).`;
      }
    } else {
      return `Stayed at (${s.current.x},${s.current.y}) because neighbor was worse and not accepted.`;
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="text-2xl font-bold mb-4">Simulated Annealing Visualization</div>
      <div className="mb-2 text-gray-700 max-w-xl text-center">
        Simulated Annealing is a probabilistic optimization algorithm that can escape local maxima/minima by sometimes accepting worse solutions, especially at higher "temperatures".<br />
        <span className="text-sm text-gray-500">Observe how the algorithm can escape local maxima by accepting uphill moves early on, and gradually "cools" to focus on better solutions.</span>
      </div>
      {/* Step Controls */}
      <div className="mb-3 flex gap-2">
        <button
          onClick={() => setStep(s => Math.max(0, s - 1))}
          disabled={step === 0}
          className={`px-3 py-1 rounded ${step === 0 ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-white'}`}
        >
          Previous
        </button>
        <span className="font-mono text-lg">{step + 1} / {totalSteps}</span>
        <button
          onClick={() => setStep(s => Math.min(totalSteps - 1, s + 1))}
          disabled={step === totalSteps - 1}
          className={`px-3 py-1 rounded ${step === totalSteps - 1 ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-white'}`}
        >
          Next
        </button>
      </div>
      {/* Step Description */}
      <div className="mb-2 text-purple-700 font-semibold min-h-[2em]">{getStepDescription(current)}</div>
      {/* Annealing Info */}
      <div className="mb-2 text-sm text-gray-600">
        <b>Temperature:</b> {current.temperature.toFixed(2)} &nbsp;|&nbsp;
        <b>Current:</b> ({current.current.x},{current.current.y}) h={current.cost} &nbsp;|&nbsp;
        <b>Neighbor:</b> ({current.neighbor.x},{current.neighbor.y}) h={current.neighborCost} &nbsp;|&nbsp;
        <b>Acceptance Probability:</b> {(current.prob * 100).toFixed(0)}% &nbsp;|&nbsp;
        <b>{current.accepted ? "Accepted" : "Rejected"}</b>
      </div>
      {/* Grid */}
      <div className="border border-gray-300 bg-gray-100 rounded-md p-2">
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`, gap: '2px' }}>
          {annealGrid.flatMap((row, y) =>
            row.map((cell, x) => (
              <div
                key={`${x}-${y}`}
                style={{
                  width: `${cellSize}px`,
                  height: `${cellSize}px`,
                  backgroundColor: getCellColor(x, y),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  color: cell.isObstacle ? '#ffffff' : '#000000',
                  border: '1px solid #ccc',
                  position: 'relative'
                }}
              >
                {x === start.x && y === start.y && 'S'}
                {x === goal.x && y === goal.y && 'G'}
                {/* Show heuristic value */}
                {!cell.isObstacle && !(x === start.x && y === start.y) && !(x === goal.x && y === goal.y) && (
                  <span style={{ fontSize: '0.8em', opacity: 0.6 }}>{cell.h}</span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      {/* Legend */}
      <div className="mt-4 flex gap-4">
        <div className="flex items-center gap-1">
          <div style={{ width: 18, height: 18, background: '#4dabf7', borderRadius: 3, border: '1px solid #333' }} />
          <span className="text-sm font-mono">Start</span>
        </div>
        <div className="flex items-center gap-1">
          <div style={{ width: 18, height: 18, background: '#ff922b', borderRadius: 3, border: '1px solid #333' }} />
          <span className="text-sm font-mono">Goal</span>
        </div>
        <div className="flex items-center gap-1">
          <div style={{ width: 18, height: 18, background: '#343a40', borderRadius: 3, border: '1px solid #333' }} />
          <span className="text-sm font-mono">Obstacle</span>
        </div>
        <div className="flex items-center gap-1">
          <div style={{ width: 18, height: 18, background: '#ff6b6b', borderRadius: 3, border: '1px solid #333' }} />
          <span className="text-sm font-mono">Current</span>
        </div>
        <div className="flex items-center gap-1">
          <div style={{ width: 18, height: 18, background: '#51cf66', borderRadius: 3, border: '1px solid #333' }} />
          <span className="text-sm font-mono">Accepted Neighbor</span>
        </div>
        <div className="flex items-center gap-1">
          <div style={{ width: 18, height: 18, background: '#fab005', borderRadius: 3, border: '1px solid #333' }} />
          <span className="text-sm font-mono">Rejected Neighbor</span>
        </div>
        <div className="flex items-center gap-1">
          <div style={{ width: 18, height: 18, background: '#da77f2', borderRadius: 3, border: '1px solid #333' }} />
          <span className="text-sm font-mono">Path</span>
        </div>
      </div>
      {/* Explanation */}
      <div className="mt-6 max-w-2xl text-gray-700 text-sm text-left">
        <b>How Simulated Annealing Works:</b>
        <ul className="list-disc ml-6 mb-2">
          <li>At each step, a random neighbor is chosen.</li>
          <li>If the neighbor is better (lower heuristic), move to it.</li>
          <li>If the neighbor is worse, move to it with a probability that decreases as the temperature lowers.</li>
          <li>This allows the algorithm to escape local maxima/minima early on, but focus on the best solutions as it "cools".</li>
        </ul>
        <b>Applications:</b> Simulated Annealing is used in optimization problems where the search space has many local optima, such as scheduling, routing, and combinatorial optimization.
      </div>
    </div>
  );
};

export default SimulatedAnnealingVisualization;

// Add the visualization to the main app
// (Assume import at the top: import SimulatedAnnealingVisualization from './SimulatedAnnealing';)

// In App.tsx, add <SimulatedAnnealingVisualization /> to the main area, e.g. after HillClimbingVisualization

// Add the BlocksWorldVisualization to the main app
// (Assume import at the top: import BlocksWorldVisualization from './BlocksWorldVisualization';)

<SimulatedAnnealingVisualization />