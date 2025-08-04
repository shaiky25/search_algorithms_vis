# Search Algorithm Visualizations

A TypeScript React application that provides interactive visualizations of various search algorithms.

## Features

- **Breadth-First Search (BFS) Visualization**: Step-by-step visualization of BFS traversal on a graph
- **Hill Climbing Search Visualization**: Interactive demonstration of hill climbing algorithm with common problem scenarios
- **Blocks World Problem Visualization**: Interactive demonstration of AI planning with block stacking and rearrangement
- **Interactive Controls**: Navigate through algorithm steps with Previous/Next buttons
- **Real-time State Display**: See the current queue, visited nodes, and algorithm state
- **Educational Descriptions**: Each step includes explanations of what the algorithm is doing
- **Problem Region Visualization**: Highlight common hill climbing problems (local maxima, plateaus, ridges, shoulders)

## Technologies Used

- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **TypeScript** for type safety
- **Create React App** with TypeScript template

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd my-new-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open in your browser at `http://localhost:3000`.

## Using the Visualizations

### Hill Climbing Search Visualization

The hill climbing visualization demonstrates how the hill climbing algorithm works and its common problems.

#### Controls and Toggles:

1. **Mode Toggle Buttons**:
   - **"Gets Stuck"**: Shows how hill climbing can fail by getting stuck in a local maximum
   - **"Finds Solution"**: Shows a successful path where hill climbing reaches the goal

2. **"Show/Hide Problems" Toggle**:
   - When enabled, highlights common hill climbing problem regions with different colors:
     - **Pink**: Local Maxima - areas where the algorithm gets stuck
     - **Yellow**: Plateaus - flat regions with same heuristic values
     - **Orange**: Ridges - areas requiring non-uphill movement
     - **Teal**: Shoulders - flat regions leading to higher peaks

3. **Step Navigation**:
   - **Previous/Next buttons**: Navigate through algorithm steps
   - **Step counter**: Shows current step and total steps
   - **Step descriptions**: Explains what's happening at each step

#### Understanding the Grid:

- **Blue cell**: Start position
- **Orange cell**: Goal position  
- **Numbers in cells**: Heuristic values (Manhattan distance to goal)
- **Dark gray cells**: Obstacles
- **Colored cells during execution**: Current path, open set, closed set

#### Learning Objectives:

- Understand how hill climbing always moves toward the neighbor with the best heuristic
- See why the algorithm can get stuck in local maxima
- Learn about common terrain problems that cause hill climbing to fail
- Compare successful vs. failed pathfinding attempts

### BFS Visualization

The breadth-first search visualization shows how BFS explores a graph level by level.

#### Controls:
- **Previous/Next buttons**: Navigate through BFS steps
- **Step descriptions**: Detailed explanations of each algorithm step
- **Visual state**: See the queue, visited nodes, and current exploration

### Blocks World Problem Visualization

The Blocks World visualization demonstrates AI planning and problem-solving with block stacking and rearrangement.

#### Controls:
- **Previous/Next buttons**: Navigate through planning steps
- **Step descriptions**: Detailed explanations of each move and strategy
- **Visual state**: See the current block configuration across multiple stacks

#### Understanding the Visualization:
- **4 Stacks**: Multiple stacks available for intermediate storage and rearrangement
- **4 Blocks**: A, B, C, D with different colors for easy identification
- **Block Movement**: Only the top block of any stack can be moved
- **Goal State**: A on B on C on D (all on Stack 0)

#### Learning Objectives:
- Understand AI planning and problem decomposition
- Learn strategic block movement using multiple stacks
- See how intermediate steps are necessary for complex rearrangements
- Understand the constraints of only moving top blocks
- Learn systematic problem-solving approaches

#### Key Concepts Demonstrated:
- **Strategic Dismantling**: Moving blocks to access those underneath
- **Temporary Storage**: Using intermediate stacks to hold blocks
- **Systematic Reconstruction**: Building the goal stack step by step
- **Constraint Satisfaction**: Working within the rules of the problem

## Project Structure

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (not recommended)

## Project Structure

```
src/
├── components/
│   ├── SearchVisualization.tsx      # BFS visualization component
│   ├── hillClimbing.tsx            # Hill climbing visualization component
│   └── BlocksWorldVisualization.tsx # Blocks World planning visualization
├── App.tsx                          # Main app component
├── index.tsx                        # App entry point
├── App.css                          # App styles
├── index.css                        # Global styles with Tailwind
└── react-app-env.d.ts              # TypeScript declarations
```

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (not recommended)

## TypeScript Configuration

The project uses TypeScript with strict type checking enabled. Key configuration:

- **Strict mode**: Enabled for better type safety
- **JSX**: Configured for React 17+ JSX transform
- **Module resolution**: Node.js style
- **Target**: ES5 for broad browser compatibility

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the MIT License.
