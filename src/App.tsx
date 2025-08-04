import React from 'react';
import './App.css';
import SearchVisualization from './components/SearchVisualization';
import HillClimbingVisualization from './components/hillClimbing';

function App(): React.JSX.Element {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Search Algorithm Visualizations</h1>
        <p>Interactive demonstrations of various search algorithms</p>
      </header>
      <main className="App-main">
        <SearchVisualization />
        <HillClimbingVisualization/>
      </main>
    </div>
  );
}

export default App; 