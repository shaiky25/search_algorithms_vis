import React from "react";

// Types for CSP visualization
type Variable = {
  name: string;
  domain: string[];
  assigned?: string;
};

type Constraint = {
  variables: string[];
  description: string;
  satisfied: (assignments: Record<string, string | undefined>) => boolean;
};

const variables: Variable[] = [
  { name: "A", domain: ["Red", "Green", "Blue"] },
  { name: "B", domain: ["Red", "Green", "Blue"] },
  { name: "C", domain: ["Red", "Green", "Blue"] },
];

const constraints: Constraint[] = [
  {
    variables: ["A", "B"],
    description: "A ≠ B",
    satisfied: (a) => a["A"] && a["B"] ? a["A"] !== a["B"] : true,
  },
  {
    variables: ["B", "C"],
    description: "B ≠ C",
    satisfied: (a) => a["B"] && a["C"] ? a["B"] !== a["C"] : true,
  },
  {
    variables: ["A", "C"],
    description: "A ≠ C",
    satisfied: (a) => a["A"] && a["C"] ? a["A"] !== a["C"] : true,
  },
];

// Example steps for backtracking search
const steps: { assignments: Record<string, string>; explanation: string }[] = [
  {
    assignments: { A: "Red" },
    explanation: "Assign A = Red",
  },
  {
    assignments: { A: "Red", B: "Red" },
    explanation: "Try B = Red (violates A ≠ B)",
  },
  {
    assignments: { A: "Red", B: "Green" },
    explanation: "Assign B = Green (A ≠ B satisfied)",
  },
  {
    assignments: { A: "Red", B: "Green", C: "Red" },
    explanation: "Try C = Red (A ≠ C violated)",
  },
  {
    assignments: { A: "Red", B: "Green", C: "Blue" },
    explanation: "Assign C = Blue (all constraints satisfied)",
  },
];

const colorMap: Record<string, string> = {
  Red: "#ff6b6b",
  Green: "#51cf66",
  Blue: "#339af0",
};

const CspVisualization: React.FC = () => {
  const [step, setStep] = React.useState(0);

  const current = steps[step];
  const assignments = current.assignments;

  // Check which constraints are satisfied
  const constraintStatus = constraints.map((c) => ({
    ...c,
    ok: c.satisfied(assignments as Record<string, string | undefined>),
  }));

  return (
    <div className="flex flex-col items-center p-4">
      <div className="text-xl font-bold mb-2">Constraint Satisfaction Problem (CSP) Visualization</div>
      <div className="mb-4 text-gray-700 max-w-2xl text-center">
        <b>Example:</b> Map coloring with 3 regions (A, B, C) and 3 colors.<br />
        <b>Goal:</b> Assign a color to each region so that no two adjacent regions have the same color.
      </div>
      {/* Variable nodes */}
      <div className="flex flex-row justify-center items-end gap-16 mb-6">
        {variables.map((v) => (
          <div key={v.name} className="flex flex-col items-center">
            <div
              className="w-16 h-16 flex items-center justify-center rounded-full border-4 font-bold text-lg shadow"
              style={{
                borderColor: assignments[v.name] ? colorMap[assignments[v.name]] : "#adb5bd",
                background: assignments[v.name] ? colorMap[assignments[v.name]] + "22" : "#f8f9fa",
                color: assignments[v.name] ? "#222" : "#888",
                transition: "background 0.2s, border-color 0.2s",
              }}
            >
              {v.name}
            </div>
            <div className="mt-2 flex gap-1">
              {v.domain.map((d) => (
                <span
                  key={d}
                  className="px-2 py-0.5 rounded text-xs font-mono"
                  style={{
                    background: assignments[v.name] === d ? colorMap[d] : "#e9ecef",
                    color: assignments[v.name] === d ? "#fff" : "#495057",
                    border: assignments[v.name] === d ? "1.5px solid #333" : "1px solid #ccc",
                  }}
                >
                  {d}
                </span>
              ))}
            </div>
            {assignments[v.name] && (
              <div className="mt-1 text-xs text-gray-600">
                <b>Assigned:</b>{" "}
                <span style={{ color: colorMap[assignments[v.name]] }}>{assignments[v.name]}</span>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Constraint edges */}
      <div className="flex flex-col items-center mb-4">
        <div className="text-md font-semibold mb-1">Constraints</div>
        <div className="flex flex-col gap-1">
          {constraintStatus.map((c, i) => (
            <div key={i} className="flex items-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{
                  background: c.ok ? "#51cf66" : "#ff6b6b",
                  border: "1px solid #333",
                  marginRight: 4,
                }}
              />
              <span className={c.ok ? "text-gray-700" : "text-red-600 font-semibold"}>
                {c.description}
              </span>
              <span className="text-xs text-gray-400 ml-2">
                ({c.variables.join(", ")})
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* Stepper */}
      <div className="flex items-center gap-4 mb-2">
        <button
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          Prev
        </button>
        <span className="text-sm">
          Step {step + 1} / {steps.length}
        </span>
        <button
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm"
          onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
          disabled={step === steps.length - 1}
        >
          Next
        </button>
      </div>
      <div className="mb-4 text-gray-700 text-center max-w-lg">
        <b>Explanation:</b> {current.explanation}
      </div>
      {/* Legend */}
      <div className="mt-2 flex gap-4">
        {Object.entries(colorMap).map(([color, hex]) => (
          <div key={color} className="flex items-center gap-1">
            <div style={{
              width: 18, height: 18, background: hex, borderRadius: 3, border: '1px solid #333'
            }} />
            <span className="text-sm font-mono">{color}</span>
          </div>
        ))}
        <div className="flex items-center gap-1">
          <div style={{
            width: 18, height: 18, background: "#51cf66", borderRadius: 3, border: '1px solid #333'
          }} />
          <span className="text-sm font-mono">Constraint Satisfied</span>
        </div>
        <div className="flex items-center gap-1">
          <div style={{
            width: 18, height: 18, background: "#ff6b6b", borderRadius: 3, border: '1px solid #333'
          }} />
          <span className="text-sm font-mono">Constraint Violated</span>
        </div>
      </div>
      {/* Explanation */}
      <div className="mt-6 max-w-2xl text-gray-700 text-sm text-left">
        <b>What is a CSP?</b>
        <ul className="list-disc ml-6 mb-2">
          <li><b>Variables:</b> Each with a domain of possible values.</li>
          <li><b>Constraints:</b> Rules that restrict the values the variables can take together.</li>
          <li><b>Goal:</b> Assign a value to every variable so that all constraints are satisfied.</li>
        </ul>
        <b>Applications:</b> Scheduling, map coloring, Sudoku, cryptarithmetic, and more.
        <br />
        <b>Common Algorithms:</b> Backtracking, Forward Checking, Arc Consistency (AC-3), etc.
      </div>
    </div>
  );
};

export default CspVisualization;
