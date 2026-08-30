import { RiCheckLine } from '@remixicon/react';

export default function FormWizard({ steps, currentStep, onStepChange }) {
    return (
        <div className="mb-8">
            <div className="flex items-center justify-between">
                {steps.map((step, idx) => {
                    const isCompleted = currentStep > step.id;
                    const isCurrent = currentStep === step.id;

                    return (
                        <div key={step.id} className="flex flex-1 items-center">
                            <div
                                onClick={() => onStepChange && onStepChange(step.id)}
                                className={`group flex items-center gap-3 cursor-pointer ${
                                    isCurrent ? 'text-emerald-700' : isCompleted ? 'text-gray-900' : 'text-gray-400'
                                }`}
                            >
                                <div
                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${
                                        isCompleted
                                            ? 'bg-emerald-600 text-white shadow-2xs'
                                            : isCurrent
                                            ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-xs'
                                            : 'bg-gray-100 text-gray-500 border border-gray-200'
                                    }`}
                                >
                                    {isCompleted ? <RiCheckLine className="h-5 w-5" /> : step.id}
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-xs font-bold leading-none tracking-tight">{step.title}</p>
                                    {step.description && (
                                        <p className="text-[10px] text-gray-500 mt-0.5 font-medium">{step.description}</p>
                                    )}
                                </div>
                            </div>

                            {idx < steps.length - 1 && (
                                <div
                                    className={`mx-3 h-0.5 flex-1 transition-colors ${
                                        currentStep > step.id ? 'bg-emerald-500' : 'bg-gray-200'
                                    }`}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
