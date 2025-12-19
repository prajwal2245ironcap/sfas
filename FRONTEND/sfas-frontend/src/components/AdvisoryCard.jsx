import { useState } from "react";
import ExplanationModal from "./ExplanationModal";

export default function AdvisoryCard({ result }) {
  const [open, setOpen] = useState(false);

  if (!result) return null;

  const confidence =
    result.ml_prediction !== undefined
      ? (result.ml_prediction * 100).toFixed(2)
      : null;

  return (
    <div className="mt-6 bg-green-50 dark:bg-green-900/20 p-6 rounded-2xl shadow-sm">
      
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Advisory Report
      </h2>

      <p className="text-sm mb-2">
        <strong>Recommendation:</strong> {result.recommendation}
      </p>

      {result.benefits && (
        <div className="mt-3 text-sm space-y-1">
          <p><strong>Yield Increase:</strong> {result.benefits.yield}%</p>
          <p><strong>Cost Reduction:</strong> {result.benefits.cost}%</p>
          <p><strong>Loss Reduction:</strong> {result.benefits.loss}%</p>
        </div>
      )}

      {/* ML RESULT */}
      {confidence && (
        <div className="mt-4 p-4 bg-green-100 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">
            🤖 ML Prediction
          </h3>

          <p>
            <strong>Confidence Score:</strong>{" "}
            <span className={
              confidence > 80 ? "text-green-700" : "text-yellow-700"
            }>
              {confidence}%
            </span>
          </p>

          <p>
            <strong>Risk Level:</strong>{" "}
            {confidence > 80 ? "Low" : "Moderate"}
          </p>
        </div>
      )}

      <button
        onClick={() => setOpen(true)}
        className="text-sm text-green-600 hover:underline mt-4"
      >
        Why this recommendation?
      </button>

      <ExplanationModal
        open={open}
        onClose={() => setOpen(false)}
        explanation={result.explanation}
      />
    </div>
  );
}
