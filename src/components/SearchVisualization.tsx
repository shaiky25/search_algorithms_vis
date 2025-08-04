import React, { useState } from 'react';

interface Node {
  id: string;
  x: number;
  y: number;
}

interface Edge {
  from: string;
  to: string;
}

interface BFSStep {
  visited: string[];
  queue: string[];
  current: string | null;
}

interface DFSStep {
  visited: string[];
  stack: string[];
  current: string | null;
}

interface GridCell {
  x: number;
  y: number;
  isObstacle: boolean;
  f: number;
  g: number;
  h: number;
}

interface AStarStep {
  openSet: Array<{x: number; y: number}>;
  closedSet: Array<{x: number; y: number}>;
  current: {x: number; y: number};
  path: Array<{x: number; y: number}>;
}

interface GreedyStep {
  openSet: Array<{x: number; y: number}>;
  closedSet: Array<{x: number; y: number}>;
  current: {x: number; y: number};
  path: Array<{x: number; y: number}>;
}

const BFSVisualization: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 8;

  // Define the graph structure
  const nodes: Node[] = [
    { id: 'A', x: 200, y: 50 },
    { id: 'B', x: 100, y: 150 },
    { id: 'C', x: 300, y: 150 },
    { id: 'D', x: 50, y: 250 },
    { id: 'E', x: 150, y: 250 },
    { id: 'F', x: 250, y: 250 },
    { id: 'G', x: 350, y: 250 }
  ];

  const edges: Edge[] = [
    { from: 'A', to: 'B' },
    { from: 'A', to: 'C' },
    { from: 'B', to: 'D' },
    { from: 'B', to: 'E' },
    { from: 'C', to: 'F' },
    { from: 'C', to: 'G' }
  ];

  // BFS traversal sequence
  const bfsSteps: BFSStep[] = [
    { visited: ['A'], queue: ['A'], current: 'A' },
    { visited: ['A', 'B', 'C'], queue: ['B', 'C'], current: 'A' },
    { visited: ['A', 'B', 'C'], queue: ['C', 'D', 'E'], current: 'B' },
    { visited: ['A', 'B', 'C', 'D', 'E'], queue: ['C', 'D', 'E'], current: 'B' },
    { visited: ['A', 'B', 'C', 'D', 'E'], queue: ['D', 'E', 'F', 'G'], current: 'C' },
    { visited: ['A', 'B', 'C', 'D', 'E', 'F', 'G'], queue: ['D', 'E', 'F', 'G'], current: 'C' },
    { visited: ['A', 'B', 'C', 'D', 'E', 'F', 'G'], queue: ['E', 'F', 'G'], current: 'D' },
    { visited: ['A', 'B', 'C', 'D', 'E', 'F', 'G'], queue: [], current: null }
  ];

  const getNodeColor = (nodeId: string): string => {
    const step = bfsSteps[currentStep];
    if (nodeId === step.current) return '#ff6b6b'; // Current node (red)
    if (step.visited.includes(nodeId)) return '#51cf66'; // Visited node (green)
    if (step.queue.includes(nodeId)) return '#339af0'; // In queue (blue)
    return '#f8f9fa'; // Unvisited (white)
  };

  const getEdgeColor = (from: string, to: string): string => {
    const step = bfsSteps[currentStep];
    if (step.visited.includes(from) && step.visited.includes(to)) {
      return '#51cf66'; // Visited edge (green)
    }
    return '#adb5bd'; // Unvisited edge (gray)
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-2xl font-bold mb-4">Breadth-First Search Visualization</div>
      
      {/* SVG for the graph */}
      <svg width="400" height="300" className="border border-gray-300 bg-gray-100 rounded-md">
        {/* Draw edges */}
        {edges.map((edge, idx) => {
          const fromNode = nodes.find(n => n.id === edge.from);
          const toNode = nodes.find(n => n.id === edge.to);
          if (!fromNode || !toNode) return null;
          return (
            <line 
              key={idx}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke={getEdgeColor(edge.from, edge.to)}
              strokeWidth="2"
            />
          );
        })}
        
        {/* Draw nodes */}
        {nodes.map((node) => (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r="20"
              fill={getNodeColor(node.id)}
              stroke="#343a40"
              strokeWidth="2"
            />
            <text
              x={node.x}
              y={node.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#343a40"
              fontWeight="bold"
            >
              {node.id}
            </text>
          </g>
        ))}
      </svg>
      
      {/* Controls and information */}
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
        
        {/* Queue and visited information */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-gray-100 p-3 rounded-md">
            <div className="font-semibold mb-1">Queue:</div>
            <div className="flex gap-2">
              {bfsSteps[currentStep].queue.map((nodeId, idx) => (
                <div key={idx} className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-md">
                  {nodeId}
                </div>
              ))}
              {bfsSteps[currentStep].queue.length === 0 && 
                <span className="text-gray-500 italic">Empty</span>
              }
            </div>
          </div>
          <div className="bg-gray-100 p-3 rounded-md">
            <div className="font-semibold mb-1">Visited:</div>
            <div className="flex gap-2 flex-wrap">
              {bfsSteps[currentStep].visited.map((nodeId, idx) => (
                <div key={idx} className="w-8 h-8 bg-green-500 text-white flex items-center justify-center rounded-md">
                  {nodeId}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Step description */}
        <div className="mt-4 p-3 bg-gray-100 rounded-md">
          <div className="font-semibold mb-1">Current action:</div>
          {currentStep === 0 && <div>Starting BFS from node A. Add A to queue and mark as visited.</div>}
          {currentStep === 1 && <div>Process node A. Add its neighbors (B, C) to queue and mark them as visited.</div>}
          {currentStep === 2 && <div>Dequeue and process node B. Add its unvisited neighbors (D, E) to queue.</div>}
          {currentStep === 3 && <div>Mark D and E as visited.</div>}
          {currentStep === 4 && <div>Dequeue and process node C. Add its unvisited neighbors (F, G) to queue.</div>}
          {currentStep === 5 && <div>Mark F and G as visited.</div>}
          {currentStep === 6 && <div>Dequeue and process node D. It has no unvisited neighbors.</div>}
          {currentStep === 7 && <div>Continue processing remaining nodes in queue. BFS traversal complete!</div>}
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-6 flex gap-4 justify-center">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-white border border-gray-400 mr-1"></div>
          <span>Unvisited</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-500 mr-1"></div>
          <span>In Queue</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 mr-1"></div>
          <span>Processed</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 mr-1"></div>
          <span>Current</span>
        </div>
      </div>
    </div>
  );
};

const DFSVisualization: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 8;

  // Define the graph structure (same as BFS)
  const nodes: Node[] = [
    { id: 'A', x: 200, y: 50 },
    { id: 'B', x: 100, y: 150 },
    { id: 'C', x: 300, y: 150 },
    { id: 'D', x: 50, y: 250 },
    { id: 'E', x: 150, y: 250 },
    { id: 'F', x: 250, y: 250 },
    { id: 'G', x: 350, y: 250 }
  ];

  const edges: Edge[] = [
    { from: 'A', to: 'B' },
    { from: 'A', to: 'C' },
    { from: 'B', to: 'D' },
    { from: 'B', to: 'E' },
    { from: 'C', to: 'F' },
    { from: 'C', to: 'G' }
  ];

  // DFS traversal sequence (depth-first approach)
  const dfsSteps: DFSStep[] = [
    { visited: ['A'], stack: ['A'], current: 'A' },
    { visited: ['A', 'B'], stack: ['A', 'B'], current: 'B' },
    { visited: ['A', 'B', 'D'], stack: ['A', 'B', 'D'], current: 'D' },
    { visited: ['A', 'B', 'D'], stack: ['A', 'B'], current: 'D' },
    { visited: ['A', 'B', 'E'], stack: ['A', 'B', 'E'], current: 'E' },
    { visited: ['A', 'B', 'E'], stack: ['A'], current: 'E' },
    { visited: ['A', 'C'], stack: ['A', 'C'], current: 'C' },
    { visited: ['A', 'C', 'F'], stack: ['A', 'C', 'F'], current: 'F' }
  ];

  const getNodeColor = (nodeId: string): string => {
    const step = dfsSteps[currentStep];
    if (nodeId === step.current) return '#ff6b6b'; // Current node (red)
    if (step.visited.includes(nodeId)) return '#51cf66'; // Visited node (green)
    if (step.stack.includes(nodeId)) return '#339af0'; // In stack (blue)
    return '#f8f9fa'; // Unvisited (white)
  };

  const getEdgeColor = (from: string, to: string): string => {
    const step = dfsSteps[currentStep];
    if (step.visited.includes(from) && step.visited.includes(to)) {
      return '#51cf66'; // Visited edge (green)
    }
    return '#adb5bd'; // Unvisited edge (gray)
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-2xl font-bold mb-4">Depth-First Search Visualization</div>
      
      {/* SVG for the graph */}
      <svg width="400" height="300" className="border border-gray-300 bg-gray-100 rounded-md">
        {/* Draw edges */}
        {edges.map((edge, idx) => {
          const fromNode = nodes.find(n => n.id === edge.from);
          const toNode = nodes.find(n => n.id === edge.to);
          if (!fromNode || !toNode) return null;
          return (
            <line 
              key={idx}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke={getEdgeColor(edge.from, edge.to)}
              strokeWidth="2"
            />
          );
        })}
        
        {/* Draw nodes */}
        {nodes.map((node) => (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r="20"
              fill={getNodeColor(node.id)}
              stroke="#343a40"
              strokeWidth="2"
            />
            <text
              x={node.x}
              y={node.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#343a40"
              fontWeight="bold"
            >
              {node.id}
            </text>
          </g>
        ))}
      </svg>
      
      {/* Controls and information */}
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
        
        {/* Stack and visited information */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-gray-100 p-3 rounded-md">
            <div className="font-semibold mb-1">Stack:</div>
            <div className="flex gap-2">
              {dfsSteps[currentStep].stack.map((nodeId, idx) => (
                <div key={idx} className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-md">
                  {nodeId}
                </div>
              ))}
              {dfsSteps[currentStep].stack.length === 0 && 
                <span className="text-gray-500 italic">Empty</span>
              }
            </div>
          </div>
          <div className="bg-gray-100 p-3 rounded-md">
            <div className="font-semibold mb-1">Visited:</div>
            <div className="flex gap-2 flex-wrap">
              {dfsSteps[currentStep].visited.map((nodeId, idx) => (
                <div key={idx} className="w-8 h-8 bg-green-500 text-white flex items-center justify-center rounded-md">
                  {nodeId}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Step description */}
        <div className="mt-4 p-3 bg-gray-100 rounded-md">
          <div className="font-semibold mb-1">Current action:</div>
          {currentStep === 0 && <div>Starting DFS from node A. Add A to stack and mark as visited.</div>}
          {currentStep === 1 && <div>Explore deeper to node B. Add B to stack and mark as visited.</div>}
          {currentStep === 2 && <div>Continue deeper to node D. Add D to stack and mark as visited.</div>}
          {currentStep === 3 && <div>Backtrack from D (no more unvisited neighbors). Remove D from stack.</div>}
          {currentStep === 4 && <div>Backtrack to B and explore E. Add E to stack and mark as visited.</div>}
          {currentStep === 5 && <div>Backtrack from E. Remove E from stack and continue backtracking.</div>}
          {currentStep === 6 && <div>Backtrack to A and explore C. Add C to stack and mark as visited.</div>}
          {currentStep === 7 && <div>Continue deeper to node F. DFS explores depth-first, not breadth-first.</div>}
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-6 flex gap-4 justify-center">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-white border border-gray-400 mr-1"></div>
          <span>Unvisited</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-500 mr-1"></div>
          <span>In Stack</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 mr-1"></div>
          <span>Processed</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 mr-1"></div>
          <span>Current</span>
        </div>
      </div>
    </div>
  );
};

const AStarVisualization: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 11;
  
  // Grid configuration
  const gridSize = 8;
  const cellSize = 40;
  
  // Define the grid with obstacles and costs
  const createGrid = (): GridCell[][] => {
    const grid: GridCell[][] = [];
    for (let y = 0; y < gridSize; y++) {
      const row: GridCell[] = [];
      for (let x = 0; x < gridSize; x++) {
        // Add some obstacles
        const isObstacle = (
          (x === 2 && y >= 1 && y <= 5) || 
          (x === 5 && y >= 2 && y <= 6) ||
          (x === 3 && y === 3) ||
          (x === 4 && y === 3)
        );
        row.push({
          x,
          y,
          isObstacle,
          f: 0,
          g: 0,
          h: 0
        });
      }
      grid.push(row);
    }
    return grid;
  };
  
  const grid = createGrid();
  const start = { x: 1, y: 1 };
  const goal = { x: 6, y: 6 };
  
  // A* search steps - complete path to goal
  const aStarSteps: AStarStep[] = [
    { 
      openSet: [{x:1, y:1}], 
      closedSet: [], 
      current: {x:1, y:1},
      path: []
    },
    { 
      openSet: [{x:1, y:2}, {x:2, y:1}, {x:1, y:0}, {x:0, y:1}], 
      closedSet: [{x:1, y:1}], 
      current: {x:1, y:2},
      path: [{x:1, y:2}, {x:1, y:1}]
    },
    { 
      openSet: [{x:2, y:1}, {x:1, y:0}, {x:0, y:1}, {x:1, y:3}, {x:0, y:2}], 
      closedSet: [{x:1, y:1}, {x:1, y:2}], 
      current: {x:1, y:3},
      path: [{x:1, y:3}, {x:1, y:2}, {x:1, y:1}]
    },
    { 
      openSet: [{x:2, y:1}, {x:1, y:0}, {x:0, y:1}, {x:0, y:2}, {x:1, y:4}, {x:0, y:3}], 
      closedSet: [{x:1, y:1}, {x:1, y:2}, {x:1, y:3}], 
      current: {x:1, y:4},
      path: [{x:1, y:4}, {x:1, y:3}, {x:1, y:2}, {x:1, y:1}]
    },
    { 
      openSet: [{x:2, y:1}, {x:1, y:0}, {x:0, y:1}, {x:0, y:2}, {x:0, y:3}, {x:1, y:5}, {x:0, y:4}], 
      closedSet: [{x:1, y:1}, {x:1, y:2}, {x:1, y:3}, {x:1, y:4}], 
      current: {x:1, y:5},
      path: [{x:1, y:5}, {x:1, y:4}, {x:1, y:3}, {x:1, y:2}, {x:1, y:1}]
    },
    { 
      openSet: [{x:2, y:1}, {x:1, y:0}, {x:0, y:1}, {x:0, y:2}, {x:0, y:3}, {x:0, y:4}, {x:2, y:5}, {x:1, y:6}, {x:0, y:5}], 
      closedSet: [{x:1, y:1}, {x:1, y:2}, {x:1, y:3}, {x:1, y:4}, {x:1, y:5}], 
      current: {x:1, y:6},
      path: [{x:1, y:6}, {x:1, y:5}, {x:1, y:4}, {x:1, y:3}, {x:1, y:2}, {x:1, y:1}]
    },
    { 
      openSet: [{x:2, y:1}, {x:1, y:0}, {x:0, y:1}, {x:0, y:2}, {x:0, y:3}, {x:0, y:4}, {x:2, y:5}, {x:0, y:5}, {x:2, y:6}, {x:0, y:6}], 
      closedSet: [{x:1, y:1}, {x:1, y:2}, {x:1, y:3}, {x:1, y:4}, {x:1, y:5}, {x:1, y:6}], 
      current: {x:2, y:6},
      path: [{x:2, y:6}, {x:1, y:6}, {x:1, y:5}, {x:1, y:4}, {x:1, y:3}, {x:1, y:2}, {x:1, y:1}]
    },
    { 
      openSet: [{x:2, y:1}, {x:1, y:0}, {x:0, y:1}, {x:0, y:2}, {x:0, y:3}, {x:0, y:4}, {x:2, y:5}, {x:0, y:5}, {x:0, y:6}, {x:3, y:6}, {x:2, y:5}, {x:2, y:7}], 
      closedSet: [{x:1, y:1}, {x:1, y:2}, {x:1, y:3}, {x:1, y:4}, {x:1, y:5}, {x:1, y:6}, {x:2, y:6}], 
      current: {x:3, y:6},
      path: [{x:3, y:6}, {x:2, y:6}, {x:1, y:6}, {x:1, y:5}, {x:1, y:4}, {x:1, y:3}, {x:1, y:2}, {x:1, y:1}]
    },
    { 
      openSet: [{x:2, y:1}, {x:1, y:0}, {x:0, y:1}, {x:0, y:2}, {x:0, y:3}, {x:0, y:4}, {x:2, y:5}, {x:0, y:5}, {x:0, y:6}, {x:2, y:5}, {x:2, y:7}, {x:4, y:6}, {x:3, y:5}, {x:3, y:7}], 
      closedSet: [{x:1, y:1}, {x:1, y:2}, {x:1, y:3}, {x:1, y:4}, {x:1, y:5}, {x:1, y:6}, {x:2, y:6}, {x:3, y:6}], 
      current: {x:4, y:6},
      path: [{x:4, y:6}, {x:3, y:6}, {x:2, y:6}, {x:1, y:6}, {x:1, y:5}, {x:1, y:4}, {x:1, y:3}, {x:1, y:2}, {x:1, y:1}]
    },
    { 
      openSet: [{x:2, y:1}, {x:1, y:0}, {x:0, y:1}, {x:0, y:2}, {x:0, y:3}, {x:0, y:4}, {x:2, y:5}, {x:0, y:5}, {x:0, y:6}, {x:2, y:5}, {x:2, y:7}, {x:3, y:5}, {x:3, y:7}, {x:5, y:6}, {x:4, y:5}, {x:4, y:7}], 
      closedSet: [{x:1, y:1}, {x:1, y:2}, {x:1, y:3}, {x:1, y:4}, {x:1, y:5}, {x:1, y:6}, {x:2, y:6}, {x:3, y:6}, {x:4, y:6}], 
      current: {x:5, y:6},
      path: [{x:5, y:6}, {x:4, y:6}, {x:3, y:6}, {x:2, y:6}, {x:1, y:6}, {x:1, y:5}, {x:1, y:4}, {x:1, y:3}, {x:1, y:2}, {x:1, y:1}]
    },
    { 
      openSet: [{x:2, y:1}, {x:1, y:0}, {x:0, y:1}, {x:0, y:2}, {x:0, y:3}, {x:0, y:4}, {x:2, y:5}, {x:0, y:5}, {x:0, y:6}, {x:2, y:5}, {x:2, y:7}, {x:3, y:5}, {x:3, y:7}, {x:4, y:5}, {x:4, y:7}, {x:6, y:6}, {x:5, y:5}, {x:5, y:7}], 
      closedSet: [{x:1, y:1}, {x:1, y:2}, {x:1, y:3}, {x:1, y:4}, {x:1, y:5}, {x:1, y:6}, {x:2, y:6}, {x:3, y:6}, {x:4, y:6}, {x:5, y:6}], 
      current: {x:6, y:6},
      path: [{x:6, y:6}, {x:5, y:6}, {x:4, y:6}, {x:3, y:6}, {x:2, y:6}, {x:1, y:6}, {x:1, y:5}, {x:1, y:4}, {x:1, y:3}, {x:1, y:2}, {x:1, y:1}]
    }
  ];

  const getCellColor = (x: number, y: number): string => {
    const step = aStarSteps[currentStep];
    
    // Check if this is start or goal
    if (x === start.x && y === start.y) return '#4dabf7'; // Start (blue)
    if (x === goal.x && y === goal.y) return '#ff922b'; // Goal (orange)
    
    // Check if this cell is an obstacle
    const gridCell = grid[y][x];
    if (gridCell.isObstacle) return '#343a40'; // Obstacle (dark gray)
    
    // Check if this is current cell
    if (x === step.current.x && y === step.current.y) return '#ff6b6b'; // Current (red)
    
    // Check if this cell is in the closed set
    if (step.closedSet.some(cell => cell.x === x && cell.y === y)) return '#51cf66'; // Closed set (green)
    
    // Check if this cell is in the open set
    if (step.openSet.some(cell => cell.x === x && cell.y === y)) return '#fab005'; // Open set (yellow)
    
    // Check if this cell is in the path
    if (step.path.some(cell => cell.x === x && cell.y === y)) return '#da77f2'; // Path (purple)
    
    // Default unvisited cell
    return '#f8f9fa'; // Unvisited (white)
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className="text-2xl font-bold mb-4">A* Search Visualization</div>
      
      {/* Grid */}
      <div className="border border-gray-300 bg-gray-100 rounded-md p-2">
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`, gap: '2px' }}>
          {grid.flatMap((row, y) => 
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
                  color: cell.isObstacle ? '#ffffff' : '#000000'
                }}
              >
                {x === start.x && y === start.y && 'S'}
                {x === goal.x && y === goal.y && 'G'}
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
          {currentStep === 0 && <div>Starting A* search from node (1,1). Add start node to open set.</div>}
          {currentStep === 1 && <div>Process node (1,1). Move it to closed set and add its neighbors to open set.</div>}
          {currentStep === 2 && <div>Select node (1,2) with lowest f-score. Add its neighbors to open set.</div>}
          {currentStep === 3 && <div>Continue with node (1,3), expanding toward the goal while avoiding obstacles.</div>}
          {currentStep === 4 && <div>Process node (1,4), adding new neighbors to open set.</div>}
          {currentStep === 5 && <div>Continue with node (1,5), moving closer to the goal.</div>}
          {currentStep === 6 && <div>Reach node (1,6), now exploring horizontally to find optimal path around obstacles.</div>}
          {currentStep === 7 && <div>Move to (2,6), exploring alternative paths to avoid the vertical obstacle.</div>}
          {currentStep === 8 && <div>Continue to (3,6), finding a path that goes around the obstacles.</div>}
          {currentStep === 9 && <div>Move to (4,6), getting closer to the goal while maintaining optimal path.</div>}
          {currentStep === 9 && <div>Reach (5,6), almost at the goal!</div>}
          {currentStep === 10 && <div>Goal reached at (6,6)! A* found the optimal path balancing cost and heuristic.</div>}
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
      </div>
    </div>
  );
};

const GreedyBestFirstVisualization: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [greedyMode, setGreedyMode] = useState<'stuck' | 'success'>('stuck');
  
  // Grid configuration - same setup as A* but with different algorithm behavior
  const gridSize = 8;
  const cellSize = 40;
  
  // Define the grid with obstacles
  const createGrid = (): GridCell[][] => {
    const grid: GridCell[][] = [];
    for (let y = 0; y < gridSize; y++) {
      const row: GridCell[] = [];
      for (let x = 0; x < gridSize; x++) {
        // Add some obstacles
        const isObstacle = (
          (x === 2 && y >= 1 && y <= 5) || 
          (x === 5 && y >= 2 && y <= 6) ||
          (x === 3 && y === 3) ||
          (x === 4 && y === 3)
        );
        row.push({
          x,
          y,
          isObstacle,
          f: 0,
          g: 0,
          h: 0
        });
      }
      grid.push(row);
    }
    return grid;
  };
  
  const grid = createGrid();
  const start = { x: 1, y: 1 };
  const goal = { x: 6, y: 6 };
  
  // Greedy Best-First Search steps - gets stuck in local minimum
  const greedyStepsStuck: GreedyStep[] = [
    { 
      openSet: [{x:1, y:1}], 
      closedSet: [], 
      current: {x:1, y:1},
      path: []
    },
    { 
      openSet: [{x:1, y:0}, {x:0, y:1}, {x:1, y:2}, {x:2, y:1}], 
      closedSet: [{x:1, y:1}], 
      current: {x:2, y:1},
      path: [{x:2, y:1}, {x:1, y:1}]
    },
    { 
      openSet: [{x:1, y:0}, {x:0, y:1}, {x:1, y:2}, {x:3, y:1}, {x:2, y:0}, {x:2, y:2}], 
      closedSet: [{x:1, y:1}, {x:2, y:1}], 
      current: {x:3, y:1},
      path: [{x:3, y:1}, {x:2, y:1}, {x:1, y:1}]
    },
    { 
      openSet: [{x:1, y:0}, {x:0, y:1}, {x:1, y:2}, {x:2, y:0}, {x:2, y:2}, {x:4, y:1}, {x:3, y:0}, {x:3, y:2}], 
      closedSet: [{x:1, y:1}, {x:2, y:1}, {x:3, y:1}], 
      current: {x:4, y:1},
      path: [{x:4, y:1}, {x:3, y:1}, {x:2, y:1}, {x:1, y:1}]
    },
    { 
      openSet: [{x:1, y:0}, {x:0, y:1}, {x:1, y:2}, {x:2, y:0}, {x:2, y:2}, {x:3, y:0}, {x:3, y:2}, {x:5, y:1}, {x:4, y:0}, {x:4, y:2}], 
      closedSet: [{x:1, y:1}, {x:2, y:1}, {x:3, y:1}, {x:4, y:1}], 
      current: {x:5, y:1},
      path: [{x:5, y:1}, {x:4, y:1}, {x:3, y:1}, {x:2, y:1}, {x:1, y:1}]
    },
    { 
      openSet: [{x:1, y:0}, {x:0, y:1}, {x:1, y:2}, {x:2, y:0}, {x:2, y:2}, {x:3, y:0}, {x:3, y:2}, {x:4, y:0}, {x:4, y:2}, {x:6, y:1}, {x:5, y:0}, {x:5, y:2}], 
      closedSet: [{x:1, y:1}, {x:2, y:1}, {x:3, y:1}, {x:4, y:1}, {x:5, y:1}], 
      current: {x:6, y:1},
      path: [{x:6, y:1}, {x:5, y:1}, {x:4, y:1}, {x:3, y:1}, {x:2, y:1}, {x:1, y:1}]
    },
    { 
      openSet: [{x:1, y:0}, {x:0, y:1}, {x:1, y:2}, {x:2, y:0}, {x:2, y:2}, {x:3, y:0}, {x:3, y:2}, {x:4, y:0}, {x:4, y:2}, {x:5, y:0}, {x:5, y:2}, {x:6, y:0}, {x:6, y:2}], 
      closedSet: [{x:1, y:1}, {x:2, y:1}, {x:3, y:1}, {x:4, y:1}, {x:5, y:1}, {x:6, y:1}], 
      current: {x:6, y:2},
      path: [{x:6, y:2}, {x:6, y:1}, {x:5, y:1}, {x:4, y:1}, {x:3, y:1}, {x:2, y:1}, {x:1, y:1}]
    },
    { 
      openSet: [{x:1, y:0}, {x:0, y:1}, {x:1, y:2}, {x:2, y:0}, {x:2, y:2}, {x:3, y:0}, {x:3, y:2}, {x:4, y:0}, {x:4, y:2}, {x:5, y:0}, {x:5, y:2}, {x:6, y:0}, {x:6, y:3}], 
      closedSet: [{x:1, y:1}, {x:2, y:1}, {x:3, y:1}, {x:4, y:1}, {x:5, y:1}, {x:6, y:1}, {x:6, y:2}], 
      current: {x:6, y:3},
      path: [{x:6, y:3}, {x:6, y:2}, {x:6, y:1}, {x:5, y:1}, {x:4, y:1}, {x:3, y:1}, {x:2, y:1}, {x:1, y:1}]
    },
    { 
      openSet: [{x:1, y:0}, {x:0, y:1}, {x:1, y:2}, {x:2, y:0}, {x:2, y:2}, {x:3, y:0}, {x:3, y:2}, {x:4, y:0}, {x:4, y:2}, {x:5, y:0}, {x:5, y:2}, {x:6, y:0}, {x:6, y:4}], 
      closedSet: [{x:1, y:1}, {x:2, y:1}, {x:3, y:1}, {x:4, y:1}, {x:5, y:1}, {x:6, y:1}, {x:6, y:2}, {x:6, y:3}], 
      current: {x:6, y:4},
      path: [{x:6, y:4}, {x:6, y:3}, {x:6, y:2}, {x:6, y:1}, {x:5, y:1}, {x:4, y:1}, {x:3, y:1}, {x:2, y:1}, {x:1, y:1}]
    },
    { 
      openSet: [{x:1, y:0}, {x:0, y:1}, {x:1, y:2}, {x:2, y:0}, {x:2, y:2}, {x:3, y:0}, {x:3, y:2}, {x:4, y:0}, {x:4, y:2}, {x:5, y:0}, {x:5, y:2}, {x:6, y:0}, {x:6, y:5}], 
      closedSet: [{x:1, y:1}, {x:2, y:1}, {x:3, y:1}, {x:4, y:1}, {x:5, y:1}, {x:6, y:1}, {x:6, y:2}, {x:6, y:3}, {x:6, y:4}], 
      current: {x:6, y:5},
      path: [{x:6, y:5}, {x:6, y:4}, {x:6, y:3}, {x:6, y:2}, {x:6, y:1}, {x:5, y:1}, {x:4, y:1}, {x:3, y:1}, {x:2, y:1}, {x:1, y:1}]
    },
    { 
      openSet: [{x:1, y:0}, {x:0, y:1}, {x:1, y:2}, {x:2, y:0}, {x:2, y:2}, {x:3, y:0}, {x:3, y:2}, {x:4, y:0}, {x:4, y:2}, {x:5, y:0}, {x:5, y:2}, {x:6, y:0}], 
      closedSet: [{x:1, y:1}, {x:2, y:1}, {x:3, y:1}, {x:4, y:1}, {x:5, y:1}, {x:6, y:1}, {x:6, y:2}, {x:6, y:3}, {x:6, y:4}, {x:6, y:5}], 
      current: {x:6, y:0},
      path: [{x:6, y:0}, {x:6, y:1}, {x:5, y:1}, {x:4, y:1}, {x:3, y:1}, {x:2, y:1}, {x:1, y:1}]
    }
  ];

  // Greedy Best-First Search steps - successful path to goal
  const greedyStepsSuccess: GreedyStep[] = [
    { 
      openSet: [{x:1, y:1}], 
      closedSet: [], 
      current: {x:1, y:1},
      path: []
    },
    { 
      openSet: [{x:1, y:0}, {x:0, y:1}, {x:1, y:2}, {x:2, y:1}], 
      closedSet: [{x:1, y:1}], 
      current: {x:1, y:2},
      path: [{x:1, y:2}, {x:1, y:1}]
    },
    { 
      openSet: [{x:1, y:0}, {x:0, y:1}, {x:2, y:1}, {x:1, y:3}, {x:0, y:2}], 
      closedSet: [{x:1, y:1}, {x:1, y:2}], 
      current: {x:1, y:3},
      path: [{x:1, y:3}, {x:1, y:2}, {x:1, y:1}]
    },
    { 
      openSet: [{x:1, y:0}, {x:0, y:1}, {x:2, y:1}, {x:0, y:2}, {x:1, y:4}, {x:0, y:3}], 
      closedSet: [{x:1, y:1}, {x:1, y:2}, {x:1, y:3}], 
      current: {x:1, y:4},
      path: [{x:1, y:4}, {x:1, y:3}, {x:1, y:2}, {x:1, y:1}]
    },
    { 
      openSet: [{x:1, y:0}, {x:0, y:1}, {x:2, y:1}, {x:0, y:2}, {x:0, y:3}, {x:1, y:5}, {x:0, y:4}], 
      closedSet: [{x:1, y:1}, {x:1, y:2}, {x:1, y:3}, {x:1, y:4}], 
      current: {x:1, y:5},
      path: [{x:1, y:5}, {x:1, y:4}, {x:1, y:3}, {x:1, y:2}, {x:1, y:1}]
    },
    { 
      openSet: [{x:1, y:0}, {x:0, y:1}, {x:2, y:1}, {x:0, y:2}, {x:0, y:3}, {x:0, y:4}, {x:1, y:6}, {x:0, y:5}], 
      closedSet: [{x:1, y:1}, {x:1, y:2}, {x:1, y:3}, {x:1, y:4}, {x:1, y:5}], 
      current: {x:1, y:6},
      path: [{x:1, y:6}, {x:1, y:5}, {x:1, y:4}, {x:1, y:3}, {x:1, y:2}, {x:1, y:1}]
    },
    { 
      openSet: [{x:1, y:0}, {x:0, y:1}, {x:2, y:1}, {x:0, y:2}, {x:0, y:3}, {x:0, y:4}, {x:0, y:5}, {x:2, y:6}, {x:0, y:6}], 
      closedSet: [{x:1, y:1}, {x:1, y:2}, {x:1, y:3}, {x:1, y:4}, {x:1, y:5}, {x:1, y:6}], 
      current: {x:2, y:6},
      path: [{x:2, y:6}, {x:1, y:6}, {x:1, y:5}, {x:1, y:4}, {x:1, y:3}, {x:1, y:2}, {x:1, y:1}]
    },
    { 
      openSet: [{x:1, y:0}, {x:0, y:1}, {x:2, y:1}, {x:0, y:2}, {x:0, y:3}, {x:0, y:4}, {x:0, y:5}, {x:0, y:6}, {x:3, y:6}, {x:2, y:5}, {x:2, y:7}], 
      closedSet: [{x:1, y:1}, {x:1, y:2}, {x:1, y:3}, {x:1, y:4}, {x:1, y:5}, {x:1, y:6}, {x:2, y:6}], 
      current: {x:3, y:6},
      path: [{x:3, y:6}, {x:2, y:6}, {x:1, y:6}, {x:1, y:5}, {x:1, y:4}, {x:1, y:3}, {x:1, y:2}, {x:1, y:1}]
    },
    { 
      openSet: [{x:1, y:0}, {x:0, y:1}, {x:2, y:1}, {x:0, y:2}, {x:0, y:3}, {x:0, y:4}, {x:0, y:5}, {x:0, y:6}, {x:2, y:5}, {x:2, y:7}, {x:4, y:6}, {x:3, y:5}, {x:3, y:7}], 
      closedSet: [{x:1, y:1}, {x:1, y:2}, {x:1, y:3}, {x:1, y:4}, {x:1, y:5}, {x:1, y:6}, {x:2, y:6}, {x:3, y:6}], 
      current: {x:4, y:6},
      path: [{x:4, y:6}, {x:3, y:6}, {x:2, y:6}, {x:1, y:6}, {x:1, y:5}, {x:1, y:4}, {x:1, y:3}, {x:1, y:2}, {x:1, y:1}]
    },
    { 
      openSet: [{x:1, y:0}, {x:0, y:1}, {x:2, y:1}, {x:0, y:2}, {x:0, y:3}, {x:0, y:4}, {x:0, y:5}, {x:0, y:6}, {x:2, y:5}, {x:2, y:7}, {x:3, y:5}, {x:3, y:7}, {x:5, y:6}, {x:4, y:5}, {x:4, y:7}], 
      closedSet: [{x:1, y:1}, {x:1, y:2}, {x:1, y:3}, {x:1, y:4}, {x:1, y:5}, {x:1, y:6}, {x:2, y:6}, {x:3, y:6}, {x:4, y:6}], 
      current: {x:5, y:6},
      path: [{x:5, y:6}, {x:4, y:6}, {x:3, y:6}, {x:2, y:6}, {x:1, y:6}, {x:1, y:5}, {x:1, y:4}, {x:1, y:3}, {x:1, y:2}, {x:1, y:1}]
    },
    { 
      openSet: [{x:1, y:0}, {x:0, y:1}, {x:2, y:1}, {x:0, y:2}, {x:0, y:3}, {x:0, y:4}, {x:0, y:5}, {x:0, y:6}, {x:2, y:5}, {x:2, y:7}, {x:3, y:5}, {x:3, y:7}, {x:4, y:5}, {x:4, y:7}, {x:6, y:6}, {x:5, y:5}, {x:5, y:7}], 
      closedSet: [{x:1, y:1}, {x:1, y:2}, {x:1, y:3}, {x:1, y:4}, {x:1, y:5}, {x:1, y:6}, {x:2, y:6}, {x:3, y:6}, {x:4, y:6}, {x:5, y:6}], 
      current: {x:6, y:6},
      path: [{x:6, y:6}, {x:5, y:6}, {x:4, y:6}, {x:3, y:6}, {x:2, y:6}, {x:1, y:6}, {x:1, y:5}, {x:1, y:4}, {x:1, y:3}, {x:1, y:2}, {x:1, y:1}]
    }
  ];

  // Select which steps to use based on mode
  const greedySteps = greedyMode === 'stuck' ? greedyStepsStuck : greedyStepsSuccess;
  const totalSteps = greedySteps.length;
  
  const getCellColor = (x: number, y: number): string => {
    const step = greedySteps[currentStep];
    
    // Check if this is start or goal
    if (x === start.x && y === start.y) return '#4dabf7'; // Start (blue)
    if (x === goal.x && y === goal.y) return '#ff922b'; // Goal (orange)
    
    // Check if this cell is an obstacle
    const gridCell = grid[y][x];
    if (gridCell.isObstacle) return '#343a40'; // Obstacle (dark gray)
    
    // Check if this is current cell
    if (x === step.current.x && y === step.current.y) return '#ff6b6b'; // Current (red)
    
    // Check if this cell is in the closed set
    if (step.closedSet.some(cell => cell.x === x && cell.y === y)) return '#51cf66'; // Closed set (green)
    
    // Check if this cell is in the open set
    if (step.openSet.some(cell => cell.x === x && cell.y === y)) return '#fab005'; // Open set (yellow)
    
    // Check if this cell is in the path
    if (step.path.some(cell => cell.x === x && cell.y === y)) return '#da77f2'; // Path (purple)
    
    // Default unvisited cell
    return '#f8f9fa'; // Unvisited (white)
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className="text-2xl font-bold mb-4">Greedy Best-First Search Visualization</div>
      
      {/* Mode Toggle */}
      <div className="mb-4 flex gap-2">
        <button 
          onClick={() => {
            setGreedyMode('stuck');
            setCurrentStep(0);
          }}
          className={`px-4 py-2 rounded-md ${greedyMode === 'stuck' ? 'bg-red-500 text-white' : 'bg-gray-300 text-gray-700'}`}
        >
          Gets Stuck
        </button>
        <button 
          onClick={() => {
            setGreedyMode('success');
            setCurrentStep(0);
          }}
          className={`px-4 py-2 rounded-md ${greedyMode === 'success' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'}`}
        >
          Finds Solution
        </button>
      </div>
      
      {/* Grid */}
      <div className="border border-gray-300 bg-gray-100 rounded-md p-2">
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`, gap: '2px' }}>
          {grid.flatMap((row, y) => 
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
                  color: cell.isObstacle ? '#ffffff' : '#000000'
                }}
              >
                {x === start.x && y === start.y && 'S'}
                {x === goal.x && y === goal.y && 'G'}
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
          {greedyMode === 'stuck' ? (
            <>
              {currentStep === 0 && <div>Starting Greedy Best-First Search from node (1,1).</div>}
              {currentStep === 1 && <div>Greedy moves horizontally toward goal, following heuristic.</div>}
              {currentStep === 2 && <div>Continues moving right, getting closer to goal column.</div>}
              {currentStep === 3 && <div>Moves to (4,1), still following heuristic toward goal.</div>}
              {currentStep === 4 && <div>Reaches (5,1), almost at the goal column.</div>}
              {currentStep === 5 && <div>Reaches (6,1), now at the goal column! Moving vertically to goal.</div>}
              {currentStep === 6 && <div>Moves to (6,2), exploring vertically to find path to goal.</div>}
              {currentStep === 7 && <div>Continues to (6,3), finding a path around obstacles.</div>}
              {currentStep === 8 && <div>Moves to (6,4), getting closer to the goal.</div>}
              {currentStep === 9 && <div>Reaches (6,5), almost at the goal!</div>}
              {currentStep === 10 && <div>Gets stuck at (6,0)! Greedy failed to find a path to the goal due to local minimum.</div>}
            </>
          ) : (
            <>
              {currentStep === 0 && <div>Starting Greedy Best-First Search from node (1,1).</div>}
              {currentStep === 1 && <div>Greedy moves vertically toward goal, prioritizing heuristic over path cost.</div>}
              {currentStep === 2 && <div>Continues moving up the first column, getting closer to goal row.</div>}
              {currentStep === 3 && <div>Moves to (1,4), following the most direct path to goal.</div>}
              {currentStep === 4 && <div>Reaches (1,5), almost at the goal row.</div>}
              {currentStep === 5 && <div>Reaches (1,6), now at the goal row! Moving horizontally to goal.</div>}
              {currentStep === 6 && <div>Moves to (2,6), exploring horizontally to find path to goal.</div>}
              {currentStep === 7 && <div>Continues to (3,6), finding a path around obstacles.</div>}
              {currentStep === 8 && <div>Moves to (4,6), getting very close to the goal.</div>}
              {currentStep === 9 && <div>Reaches (5,6), almost at the goal!</div>}
              {currentStep === 10 && <div>Goal reached at (6,6)! Greedy found a solution using heuristic guidance.</div>}
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
      </div>
    </div>
  );
};

const SearchVisualization: React.FC = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<'bfs' | 'dfs' | 'astar' | 'greedy'>('bfs');

  return (
    <div className="p-4">
      <div className="mb-6 flex justify-center gap-4">
        <button
          onClick={() => setSelectedAlgorithm('bfs')}
          className={`px-4 py-2 rounded-md ${
            selectedAlgorithm === 'bfs' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          BFS
        </button>
        <button
          onClick={() => setSelectedAlgorithm('dfs')}
          className={`px-4 py-2 rounded-md ${
            selectedAlgorithm === 'dfs' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          DFS
        </button>
        <button
          onClick={() => setSelectedAlgorithm('astar')}
          className={`px-4 py-2 rounded-md ${
            selectedAlgorithm === 'astar' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          A* Search
        </button>
        <button
          onClick={() => setSelectedAlgorithm('greedy')}
          className={`px-4 py-2 rounded-md ${
            selectedAlgorithm === 'greedy' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Greedy Best-First
        </button>
      </div>
      
      {selectedAlgorithm === 'bfs' && <BFSVisualization />}
      {selectedAlgorithm === 'dfs' && <DFSVisualization />}
      {selectedAlgorithm === 'astar' && <AStarVisualization />}
      {selectedAlgorithm === 'greedy' && <GreedyBestFirstVisualization />}
    </div>
  );
};

export default SearchVisualization;