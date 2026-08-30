import Sidebar from '@/Layouts/Sidebar';
import AidProgramForm from './Partials/AidProgramForm';
import FormWizard from '@/Components/FormWizard';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { RiArrowLeftLine, RiArrowRightLine, RiCheckLine } from '@remixicon/react';

const PROGRAM_STEPS = [
    { id: 1, title: 'Program Info', description: 'Name & classification' },
    { id: 2, title: 'Allocation & Dates', description: 'Quantities & schedule' },
];

export default function Create() {
    const [currentStep, setCurrentStep] = useState(1);

    const { data, setData, post, processing, errors } = useForm({
        name: '', description: '', aid_type: 'Seeds', allocated_quantity: '',
        unit: '', funding_source: '', start_date: '', end_date: '', status: 'active',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('aid-programs.store'));
    };

    return (
        <Sidebar header={<h2 className="text-xl font-semibold text-gray-800">Add Aid Program</h2>}>
            <Head title="Add Aid Program" />

            <div className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl">
                    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                        <FormWizard steps={PROGRAM_STEPS} currentStep={currentStep} onStepChange={setCurrentStep} />

                        <form onSubmit={submit}>
                            <AidProgramForm data={data} setData={setData} errors={errors} currentStep={currentStep} />

                            <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-5">
                                <div>
                                    {currentStep > 1 ? (
                                        <button
                                            type="button"
                                            onClick={() => setCurrentStep(1)}
                                            className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                                        >
                                            <RiArrowLeftLine className="h-4 w-4" /> Previous
                                        </button>
                                    ) : (
                                        <Link href={route('aid-programs.index')} className="rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200">
                                            Cancel
                                        </Link>
                                    )}
                                </div>

                                <div>
                                    {currentStep < 2 ? (
                                        <button
                                            type="button"
                                            onClick={() => setCurrentStep(2)}
                                            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-2xs hover:bg-emerald-700 transition-colors"
                                        >
                                            Next Step <RiArrowRightLine className="h-4 w-4" />
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-6 py-2 text-sm font-semibold text-white shadow-2xs hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                                        >
                                            <RiCheckLine className="h-4 w-4" /> Save Program
                                        </button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Sidebar>
    );
}