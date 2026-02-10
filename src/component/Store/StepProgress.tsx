import { CheckCircle } from "lucide-react";

type Step = {
  label: string;
};

type Props = {
  steps: Step[];
  currentStep: number; // 0-based
};

const StepProgress = ({ steps, currentStep }: Props) => {
  const progressPercent =
    (currentStep / (steps.length - 1)) * 100;

  return (
    <div className="w-full px-2">
      <div className="relative flex items-center justify-between">
        {/* BACKGROUND LINE */}
        <div className="absolute left-0 right-0 top-6 h-4 -translate-y-1/2 rounded bg-gray-200" />

        {/* ACTIVE LINE */}
        <div
          className="absolute left-1 top-6 h-3 -translate-y-1/2 rounded bg-gradient-to-r from-teal-400 to-green-400 transition-all"
          style={{ width: `${progressPercent}%` }}
        />

        {steps.map((step, index) => {
          const isCompleted = index <= currentStep;

          return (
            <div
              key={index}
              className="relative z-10 flex flex-col items-center gap-2"
            >
              {/* ICON */}
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all
                  ${
                    isCompleted
                      ? "bg-gradient-to-r from-teal-400 to-green-400 border-transparent text-white"
                      : "bg-gray-100 border-gray-300 text-gray-400"
                  }
                `}
              >
                <CheckCircle size={22} />
              </div>

              {/* LABEL */}
              <span
                className={`text-sm font-medium ${
                  isCompleted ? "text-black" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepProgress;
