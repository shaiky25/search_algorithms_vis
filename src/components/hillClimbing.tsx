import React, { useState } from 'react';

interface HillClimbStep {
  openSet: Array<{x: number; y: number}>;
  closedSet: Array<{x: number; y: number}>;
  current: {x: number; y: number};
  path: Array<{x: number; y: number}>;
  stuck?: boolean;
}

const gridSize = 8;
const cellSize = 40;

// Simple grid with a "hill" (goal) and obstacles
const createHillGrid = (): { x: number; y: number; isObstacle: boolean; h: number }[][] => {
  const grid: { x: number; y: number; isObstacle: boolean; h: number }[][] = [];
  const goal = { x: 6, y: 6 };
  for (let y = 0; y < gridSize; y++) {
    const row = [];
    for (let x = 0; x < gridSize; x++) {
      // Obstacles
      const isObstacle =
        (x === 3 && y >= 2 && y <= 5) ||
        (x === 5 && y >= 1 && y <= 4) ||
        (x === 2 && y === 4);
      // Heuristic: Manhattan distance to goal
      const h = Math.abs(goal.x - x) + Math.abs(goal.y - y);
      row.push({ x, y, isObstacle, h });
    }
    grid.push(row);
  }

  // Common problems with hill climbing optimization:
  // 1. Local Maxima: The algorithm may get stuck at a peak that is lower than the global maximum.
  // 2. Plateaus: Flat areas where neighboring states have the same value, causing the algorithm to wander or stop.
  // 3. Ridges: Areas where the optimal path is not directly uphill, making it hard for the algorithm to find the best path.
  // 4. Shoulder: A flat region that leads to a higher peak, but the algorithm may not move far enough to reach it.
  // 5. Stuck at local optima: The algorithm cannot escape local optima without additional strategies (e.g., random restarts, simulated annealing).

  // To visualize these problems, we can add special markers to the grid for each scenario.
  // We'll add a "problemType" property to each cell if it is part of a local maximum, plateau, ridge, or shoulder.

  // Define problem regions for visualization
  const localMaximaCells = [{ x: 4, y: 2 }]; // Example: cell where hill climbing gets stuck
  const plateauCells = [
    { x: 2, y: 4 }, { x: 2, y: 5 }, { x: 3, y: 5 }
  ]; // Example: flat region
  const ridgeCells = [
    { x: 5, y: 2 }, { x: 5, y: 3 }
  ]; // Example: ridge region
  const shoulderCells = [
    { x: 3, y: 3 }, { x: 3, y: 4 }
  ]; // Example: shoulder region

  // Now, add a "problemType" property to each cell if it matches
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const cell = grid[y][x];
      if (localMaximaCells.some(c => c.x === x && c.y === y)) {
        (cell as any).problemType = 'localMaxima';
      } else if (plateauCells.some(c => c.x === x && c.y === y)) {
        (cell as any).problemType = 'plateau';
      } else if (ridgeCells.some(c => c.x === x && c.y === y)) {
        (cell as any).problemType = 'ridge';
      } else if (shoulderCells.some(c => c.x === x && c.y === y)) {
        (cell as any).problemType = 'shoulder';
      }
    }
  }

  return grid;
};

const hillGrid = createHillGrid();
const start = { x: 1, y: 1 };
const goal = { x: 6, y: 6 };

// Hill Climbing steps (example: gets stuck in local maximum)
const hillClimbSteps: HillClimbStep[] = [
  {
    openSet: [{x:1, y:1}],
    closedSet: [],
    current: {x:1, y:1},
    path: [{x:1, y:1}]
  },
  {
    openSet: [{x:2, y:1}, {x:1, y:2}],
    closedSet: [{x:1, y:1}],
    current: {x:2, y:1},
    path: [{x:2, y:1}, {x:1, y:1}]
  },
  {
    openSet: [{x:3, y:1}, {x:2, y:2}],
    closedSet: [{x:1, y:1}, {x:2, y:1}],
    current: {x:3, y:1},
    path: [{x:3, y:1}, {x:2, y:1}, {x:1, y:1}]
  },
  {
    openSet: [{x:4, y:1}, {x:3, y:2}],
    closedSet: [{x:1, y:1}, {x:2, y:1}, {x:3, y:1}],
    current: {x:4, y:1},
    path: [{x:4, y:1}, {x:3, y:1}, {x:2, y:1}, {x:1, y:1}]
  },
  {
    openSet: [{x:4, y:2}],
    closedSet: [{x:1, y:1}, {x:2, y:1}, {x:3, y:1}, {x:4, y:1}],
    current: {x:4, y:2},
    path: [{x:4, y:2}, {x:4, y:1}, {x:3, y:1}, {x:2, y:1}, {x:1, y:1}]
  },
  {
    openSet: [],
    closedSet: [{x:1, y:1}, {x:2, y:1}, {x:3, y:1}, {x:4, y:1}, {x:4, y:2}],
    current: {x:4, y:2},
    path: [{x:4, y:2}, {x:4, y:1}, {x:3, y:1}, {x:2, y:1}, {x:1, y:1}],
    stuck: true
  }
];

// Hill Climbing steps (example: finds solution)
const hillClimbStepsSuccess: HillClimbStep[] = [
  {
    openSet: [{x:1, y:1}],
    closedSet: [],
    current: {x:1, y:1},
    path: [{x:1, y:1}]
  },
  {
    openSet: [{x:1, y:2}, {x:2, y:1}],
    closedSet: [{x:1, y:1}],
    current: {x:1, y:2},
    path: [{x:1, y:2}, {x:1, y:1}]
  },
  {
    openSet: [{x:1, y:3}, {x:2, y:2}],
    closedSet: [{x:1, y:1}, {x:1, y:2}],
    current: {x:1, y:3},
    path: [{x:1, y:3}, {x:1, y:2}, {x:1, y:1}]
  },
  {
    openSet: [{x:1, y:4}, {x:2, y:3}],
    closedSet: [{x:1, y:1}, {x:1, y:2}, {x:1, y:3}],
    current: {x:1, y:4},
    path: [{x:1, y:4}, {x:1, y:3}, {x:1, y:2}, {x:1, y:1}]
  },
  {
    openSet: [{x:1, y:5}, {x:2, y:4}],
    closedSet: [{x:1, y:1}, {x:1, y:2}, {x:1, y:3}, {x:1, y:4}],
    current: {x:1, y:5},
    path: [{x:1, y:5}, {x:1, y:4}, {x:1, y:3}, {x:1, y:2}, {x:1, y:1}]
  },
  {
    openSet: [{x:1, y:6}, {x:2, y:5}],
    closedSet: [{x:1, y:1}, {x:1, y:2}, {x:1, y:3}, {x:1, y:4}, {x:1, y:5}],
    current: {x:1, y:6},
    path: [{x:1, y:6}, {x:1, y:5}, {x:1, y:4}, {x:1, y:3}, {x:1, y:2}, {x:1, y:1}]
  },
  {
    openSet: [{x:2, y:6}],
    closedSet: [{x:1, y:1}, {x:1, y:2}, {x:1, y:3}, {x:1, y:4}, {x:1, y:5}, {x:1, y:6}],
    current: {x:2, y:6},
    path: [{x:2, y:6}, {x:1, y:6}, {x:1, y:5}, {x:1, y:4}, {x:1, y:3}, {x:1, y:2}, {x:1, y:1}]
  },
  {
    openSet: [{x:3, y:6}],
    closedSet: [{x:1, y:1}, {x:1, y:2}, {x:1, y:3}, {x:1, y:4}, {x:1, y:5}, {x:1, y:6}, {x:2, y:6}],
    current: {x:3, y:6},
    path: [{x:3, y:6}, {x:2, y:6}, {x:1, y:6}, {x:1, y:5}, {x:1, y:4}, {x:1, y:3}, {x:1, y:2}, {x:1, y:1}]
  },
  {
    openSet: [{x:4, y:6}],
    closedSet: [{x:1, y:1}, {x:1, y:2}, {x:1, y:3}, {x:1, y:4}, {x:1, y:5}, {x:1, y:6}, {x:2, y:6}, {x:3, y:6}],
    current: {x:4, y:6},
    path: [{x:4, y:6}, {x:3, y:6}, {x:2, y:6}, {x:1, y:6}, {x:1, y:5}, {x:1, y:4}, {x:1, y:3}, {x:1, y:2}, {x:1, y:1}]
  },
  {
    openSet: [{x:5, y:6}],
    closedSet: [{x:1, y:1}, {x:1, y:2}, {x:1, y:3}, {x:1, y:4}, {x:1, y:5}, {x:1, y:6}, {x:2, y:6}, {x:3, y:6}, {x:4, y:6}],
    current: {x:5, y:6},
    path: [{x:5, y:6}, {x:4, y:6}, {x:3, y:6}, {x:2, y:6}, {x:1, y:6}, {x:1, y:5}, {x:1, y:4}, {x:1, y:3}, {x:1, y:2}, {x:1, y:1}]
  },
  {
    openSet: [{x:6, y:6}],
    closedSet: [{x:1, y:1}, {x:1, y:2}, {x:1, y:3}, {x:1, y:4}, {x:1, y:5}, {x:1, y:6}, {x:2, y:6}, {x:3, y:6}, {x:4, y:6}, {x:5, y:6}],
    current: {x:6, y:6},
    path: [{x:6, y:6}, {x:5, y:6}, {x:4, y:6}, {x:3, y:6}, {x:2, y:6}, {x:1, y:6}, {x:1, y:5}, {x:1, y:4}, {x:1, y:3}, {x:1, y:2}, {x:1, y:1}]
  }
];

const HillClimbingVisualization: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [mode, setMode] = useState<'stuck' | 'success'>('stuck');
  const [showProblems, setShowProblems] = useState(false);

  const steps = mode === 'stuck' ? hillClimbSteps : hillClimbStepsSuccess;
  const totalSteps = steps.length;

  const getCellColor = (x: number, y: number): string => {
    const step = steps[currentStep];
    if (x === start.x && y === start.y) return '#4dabf7'; // Start (blue)
    if (x === goal.x && y === goal.y) return '#ff922b'; // Goal (orange)
    const gridCell = hillGrid[y][x];
    if (gridCell.isObstacle) return '#343a40'; // Obstacle (dark gray)
    if (x === step.current.x && y === step.current.y) return '#ff6b6b'; // Current (red)
    if (step.closedSet.some(cell => cell.x === x && cell.y === y)) return '#51cf66'; // Closed set (green)
    if (step.openSet.some(cell => cell.x === x && cell.y === y)) return '#fab005'; // Open set (yellow)
    if (step.path.some(cell => cell.x === x && cell.y === y)) return '#da77f2'; // Path (purple)
    
    // Show problem regions with different colors
    if (showProblems) {
      if ((gridCell as any).problemType === 'localMaxima') return '#e64980'; // Local maxima (pink)
      if ((gridCell as any).problemType === 'plateau') return '#ffd43b'; // Plateau (yellow)
      if ((gridCell as any).problemType === 'ridge') return '#fd7e14'; // Ridge (orange)
      if ((gridCell as any).problemType === 'shoulder') return '#20c997'; // Shoulder (teal)
    }
    
    return '#f8f9fa'; // Unvisited (white)
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-2xl font-bold mb-4">Hill Climbing Search Visualization</div>
      <div className="mb-2 text-gray-700 max-w-xl text-center">
        Hill climbing is a heuristic search algorithm that always moves to the neighbor with the lowest heuristic (closest to the goal).
        It can get stuck in local maxima/minima and does not backtrack.
      </div>
      {/* Mode Toggle */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => { setMode('stuck'); setCurrentStep(0); }}
          className={`px-4 py-2 rounded-md ${mode === 'stuck' ? 'bg-red-500 text-white' : 'bg-gray-300 text-gray-700'}`}
        >
          Gets Stuck
        </button>
        <button
          onClick={() => { setMode('success'); setCurrentStep(0); }}
          className={`px-4 py-2 rounded-md ${mode === 'success' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'}`}
        >
          Finds Solution
        </button>
        <button
          onClick={() => setShowProblems(!showProblems)}
          className={`px-4 py-2 rounded-md ${showProblems ? 'bg-purple-500 text-white' : 'bg-gray-300 text-gray-700'}`}
        >
          {showProblems ? 'Hide' : 'Show'} Problems
        </button>
      </div>
      {/* Grid */}
      <div className="border border-gray-300 bg-gray-100 rounded-md p-2">
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`, gap: '2px' }}>
          {hillGrid.flatMap((row, y) =>
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
                {cell.isObstacle && <span style={{ fontSize: '1.2em' }}>⛰️</span>}
              </div>
            ))
          )}
        </div>
      </div>
      {/* Controls */}
      <div className="mt-4 w-full">
        <div className="flex justify-between items-center mb-2">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
          >
            Previous
          </button>
          <span className="font-semibold">Step {currentStep + 1} of {totalSteps}</span>
          <button
            onClick={() => setCurrentStep(Math.min(totalSteps - 1, currentStep + 1))}
            disabled={currentStep === totalSteps - 1}
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
        {/* Step description */}
        <div className="mt-4 p-3 bg-gray-100 rounded-md">
          <div className="font-semibold mb-1">Current action:</div>
          {mode === 'stuck' ? (
            <>
              {currentStep === 0 && <div>Start at (1,1). Evaluate neighbors and pick the one with the lowest heuristic.</div>}
              {currentStep === 1 && <div>Move to (2,1) (lowest h). Continue climbing toward the goal.</div>}
              {currentStep === 2 && <div>Move to (3,1). Still following the lowest heuristic neighbor.</div>}
              {currentStep === 3 && <div>Move to (4,1). No better neighbor in direction of goal due to obstacles.</div>}
              {currentStep === 4 && <div>Move to (4,2). No further progress possible; all neighbors are worse or blocked.</div>}
              {currentStep === 5 && <div>Stuck! No neighbor has a lower heuristic. Hill climbing fails to reach the goal due to local maximum.</div>}
            </>
          ) : (
            <>
              {currentStep === 0 && <div>Start at (1,1). Evaluate neighbors and pick the one with the lowest heuristic.</div>}
              {currentStep === 1 && <div>Move to (1,2) (lowest h). Continue climbing toward the goal.</div>}
              {currentStep === 2 && <div>Move to (1,3). Still following the lowest heuristic neighbor.</div>}
              {currentStep === 3 && <div>Move to (1,4). Path is clear, keep climbing.</div>}
              {currentStep === 4 && <div>Move to (1,5). Getting closer to the goal.</div>}
              {currentStep === 5 && <div>Move to (1,6). Now move horizontally toward the goal.</div>}
              {currentStep === 6 && <div>Move to (2,6). Continue right.</div>}
              {currentStep === 7 && <div>Move to (3,6). Continue right.</div>}
              {currentStep === 8 && <div>Move to (4,6). Continue right.</div>}
              {currentStep === 9 && <div>Move to (5,6). Almost there!</div>}
              {currentStep === 10 && <div>Goal reached at (6,6)! Hill climbing succeeded.</div>}
            </>
          )}
        </div>
      </div>
      {/* Legend */}
      <div className="mt-6 flex gap-4 justify-center flex-wrap">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-white border border-gray-400 mr-1"></div>
          <span>Unvisited</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-yellow-500 mr-1"></div>
          <span>Open Set</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 mr-1"></div>
          <span>Closed Set</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-purple-500 mr-1"></div>
          <span>Path</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 mr-1"></div>
          <span>Current</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-500 mr-1"></div>
          <span>Start</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-orange-500 mr-1"></div>
          <span>Goal</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-800 mr-1"></div>
          <span>Obstacle</span>
        </div>
        {showProblems && (
          <>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-pink-500 mr-1"></div>
              <span>Local Maxima</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-400 mr-1"></div>
              <span>Plateau</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-orange-500 mr-1"></div>
              <span>Ridge</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-teal-500 mr-1"></div>
              <span>Shoulder</span>
            </div>
          </>
        )}
        <div className="flex items-center">
          <span className="ml-2 text-xs text-gray-600">Number in cell: heuristic (h) value</span>
        </div>
      </div>
    </div>
  );
};

export default HillClimbingVisualization;

