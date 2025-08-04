# Search Algorithm Visualizations

A TypeScript React application that provides interactive visualizations of various search algorithms.

## Features

- **Breadth-First Search (BFS) Visualization**: Step-by-step visualization of BFS traversal on a graph
- **Interactive Controls**: Navigate through algorithm steps with Previous/Next buttons
- **Real-time State Display**: See the current queue, visited nodes, and algorithm state
- **Educational Descriptions**: Each step includes explanations of what the algorithm is doing

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

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (not recommended)

## Project Structure

```
src/
├── components/
│   └── SearchVisualization.tsx  # Main visualization component
├── App.tsx                      # Main app component
├── index.tsx                    # App entry point
├── App.css                      # App styles
├── index.css                    # Global styles with Tailwind
└── react-app-env.d.ts          # TypeScript declarations
```

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
