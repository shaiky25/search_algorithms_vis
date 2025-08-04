import React from 'react';
import './App.css';
import SearchVisualization from './components/SearchVisualization';
import HillClimbingVisualization from './components/hillClimbing';
import BlocksWorldVisualization from './components/BlocksWorldVisualization';
import SimulatedAnnealingVisualization from './components/SimulatedAnnealing';

function App(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="py-8 border-b bg-white shadow-sm">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-extrabold text-blue-700 mb-1 tracking-tight drop-shadow-sm">
            Search Algorithm Visualizations
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl text-center mb-3">
            Interactive demos of classic and modern search algorithms in AI
          </p>
          <div className="flex flex-wrap gap-2 mt-1">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">BFS</span>
            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold">Hill Climbing</span>
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">Simulated Annealing</span>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">Blocks World</span>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-12">
        <section className="bg-white rounded-lg shadow p-6">
          <SearchVisualization />
        </section>
        <section className="bg-white rounded-lg shadow p-6">
          <HillClimbingVisualization />
        </section>
        <section className="bg-white rounded-lg shadow p-6">
          <SimulatedAnnealingVisualization />
        </section>
        <section className="bg-white rounded-lg shadow p-6">
          <BlocksWorldVisualization />
        </section>
      </main>
    </div>
  );
}

export default App; 