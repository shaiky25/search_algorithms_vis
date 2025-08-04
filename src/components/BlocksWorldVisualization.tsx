import React, { useState } from 'react';

// Types for blocks and state
type Block = string;
type Stack = Block[];
type WorldState = Stack[];

// Example initial and goal states
const initialState: WorldState = [
  ['D', 'C', 'A', 'B'], // Stack 0: D on C on A on B (bottom)
  [],
  [],
  [],
];

const goalState: WorldState = [
  ['A'],
  ['B'],
  ['C']
];

// Helper to deep copy a world state
function cloneState(state: WorldState): WorldState {
  return state.map(stack => [...stack]);
}

// Block color mapping
const blockColors: Record<Block, string> = {
  A: "#4dabf7",
  B: "#ffd43b",
  C: "#ff6b6b",
  D: "#63e6be",
  E: "#b197fc"
};

const cellWidth = 60;
const cellHeight = 40;

const BlocksWorldVisualization: React.FC = () => {
  const [step, setStep] = useState(0);

  // Demo steps: initial is [D, A, C, B] (D on A on C on B), goal is [A, B, C, D] (A on B on C on D)
  const demoSteps: { state: WorldState; action: string }[] = [
    { state: [['D', 'A', 'C', 'B'], [], [], []], action: "Start: D on A on C on B (all on Stack 0)" },
    { state: [['D', 'A', 'C'], [], ['B'], []], action: "Move B from Stack 0 to Stack 2" },
    { state: [['D', 'A'], ['C'], ['B'], []], action: "Move C from Stack 0 to Stack 1" },
    { state: [['D'], ['C'], ['B', 'A'], []], action: "Move A from Stack 0 to Stack 2" },
    { state: [[], ['C'], ['B', 'A'], ['D']], action: "Move D from Stack 0 to Stack 3" },
    { state: [[], [], ['B', 'A'], ['D', 'C']], action: "Move C from Stack 1 to Stack 3" },
    { state: [[], [], ['A'], ['D', 'C', 'B']], action: "Move B from Stack 2 to Stack 3" },
    { state: [[], [], [], ['D', 'C', 'B', 'A']], action: "Move A from Stack 2 to Stack 3" },
    { state: [['A'], [], [], ['D', 'C', 'B']], action: "Move A from Stack 3 to Stack 0 (goal position)" },
    { state: [['A', 'B'], [], [], ['D', 'C']], action: "Move B from Stack 3 to Stack 0" },
    { state: [['A', 'B', 'C'], [], [], ['D']], action: "Move C from Stack 3 to Stack 0" },
    { state: [['A', 'B', 'C', 'D'], [], [], []], action: "Goal: A on B on C on D (all on Stack 0)" }
  ];
  
  const maxBlocks = Math.max(...demoSteps.map(s => Math.max(...s.state.map(stack => stack.length))));
  const current = demoSteps[step];

  return (
    <div className="flex flex-col items-center">
      <div className="text-2xl font-bold mb-2">Blocks World Problem Visualization</div>
      <div className="mb-4 text-gray-700 max-w-xl text-center">
        The <b>Blocks World</b> is a classic AI planning problem. The goal is to rearrange blocks from an initial configuration to a desired goal configuration using a robot arm that can move only one block at a time and only if it is clear (on top).
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
        <span className="font-mono text-lg">{step + 1} / {demoSteps.length}</span>
        <button
          onClick={() => setStep(s => Math.min(demoSteps.length - 1, s + 1))}
          disabled={step === demoSteps.length - 1}
          className={`px-3 py-1 rounded ${step === demoSteps.length - 1 ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-white'}`}
        >
          Next
        </button>
      </div>
      {/* Action Description */}
      <div className="mb-2 text-purple-700 font-semibold min-h-[2em]">{current.action}</div>
      
      {/* Initial and Goal States */}
      <div className="mb-4 flex gap-8 justify-center">
        <div className="text-center">
          <div className="text-sm font-semibold text-gray-600 mb-2">Initial State</div>
          <div className="flex gap-2">
            {demoSteps[0].state.filter(stack => stack.length > 0).map((stack, stackIdx) => (
              <div key={stackIdx} className="flex flex-col-reverse items-center" style={{ minHeight: cellHeight * maxBlocks }}>
                {Array.from({ length: maxBlocks }).map((_, i) => {
                  const block = stack[i];
                  return (
                    <div
                      key={i}
                      style={{
                        width: cellWidth * 0.7,
                        height: cellHeight * 0.7,
                        margin: '1px 0',
                        background: block ? blockColors[block] : 'transparent',
                        border: block ? '1px solid #333' : '1px dashed #ccc',
                        borderRadius: 4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '0.9em',
                        color: block ? '#222' : 'transparent',
                        boxShadow: block ? '0 1px 3px rgba(0,0,0,0.1)' : undefined
                      }}
                    >
                      {block || ''}
                    </div>
                  );
                })}
                <div className="mt-1 text-xs text-gray-400">Stack {stackIdx + 1}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-sm font-semibold text-gray-600 mb-2">Goal State</div>
          <div className="flex gap-2">
            {demoSteps[demoSteps.length - 1].state.filter(stack => stack.length > 0).map((stack, stackIdx) => (
              <div key={stackIdx} className="flex flex-col-reverse items-center" style={{ minHeight: cellHeight * maxBlocks }}>
                {Array.from({ length: maxBlocks }).map((_, i) => {
                  const block = stack[i];
                  return (
                    <div
                      key={i}
                      style={{
                        width: cellWidth * 0.7,
                        height: cellHeight * 0.7,
                        margin: '1px 0',
                        background: block ? blockColors[block] : 'transparent',
                        border: block ? '1px solid #333' : '1px dashed #ccc',
                        borderRadius: 4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '0.9em',
                        color: block ? '#222' : 'transparent',
                        boxShadow: block ? '0 1px 3px rgba(0,0,0,0.1)' : undefined
                      }}
                    >
                      {block || ''}
                    </div>
                  );
                })}
                <div className="mt-1 text-xs text-gray-400">Stack {stackIdx + 1}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Current State Visualization */}
      <div className="mb-2 text-sm font-semibold text-gray-600 text-center">Current State</div>
      <div
        className="flex gap-6 p-4 border rounded bg-gray-50"
        style={{ minWidth: `${cellWidth * demoSteps[0].state.length + 40}px` }}
      >
        {current.state.map((stack, stackIdx) => (
          <div key={stackIdx} className="flex flex-col-reverse items-center" style={{ minHeight: cellHeight * maxBlocks }}>
            {/* Draw blocks from bottom to top */}
            {Array.from({ length: maxBlocks }).map((_, i) => {
              const block = stack[i];
              return (
                <div
                  key={i}
                  style={{
                    width: cellWidth,
                    height: cellHeight,
                    margin: '2px 0',
                    background: block ? blockColors[block] : 'transparent',
                    border: block ? '2px solid #333' : '2px dashed #ccc',
                    borderRadius: 6,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '1.2em',
                    color: block ? '#222' : 'transparent',
                    boxShadow: block ? '0 2px 6px rgba(0,0,0,0.08)' : undefined,
                    transition: 'background 0.2s'
                  }}
                >
                  {block || ''}
                </div>
              );
            })}
            <div className="mt-1 text-xs text-gray-500">Stack {stackIdx + 1}</div>
          </div>
        ))}
      </div>
      {/* Legend */}
      <div className="mt-4 flex gap-4">
        {['A', 'B', 'C', 'D'].map(b => (
          <div key={b} className="flex items-center gap-1">
            <div style={{
              width: 18, height: 18, background: blockColors[b], borderRadius: 3, border: '1px solid #333'
            }} />
            <span className="text-sm font-mono">{b}</span>
          </div>
        ))}
      </div>
      {/* Explanation */}
      <div className="mt-6 max-w-2xl text-gray-700 text-sm text-left">
        <b>Rules:</b>
        <ul className="list-disc ml-6 mb-2">
          <li>Only one block can be moved at a time.</li>
          <li>Only the top block of any stack can be moved.</li>
          <li>A block can be placed either on the table (empty stack) or on top of another block.</li>
        </ul>
        <b>Goal:</b> Move blocks to match the goal configuration shown in the last step.<br />
        <b>Applications:</b> The Blocks World is used to study planning, search, and reasoning in AI.
      </div>
    </div>
  );
};

export default BlocksWorldVisualization;


