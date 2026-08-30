import Sidebar from '@/Layouts/Sidebar';
import AidProgramForm from './Partials/AidProgramForm';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ program }) {
    const { data, setData, put, processing, errors } = useForm({
        name: program.name, description: program.description || '', aid_type: program.aid_type,
        allocated_quantity: program.allocated_quantity, unit: program.unit,
        funding_source: program.funding_source || '', start_date: program.start_date || '',
        end_date: program.end_date || '', status: program.status,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('aid-programs.update', program.id));
    };

    return (
        <Sidebar header={<h2 className="text-xl font-semibold text-gray-800">Edit {program.name}</h2>}>
            <Head title="Edit Aid Program" />

            <div className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl">
                    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                        <form onSubmit={submit}>
                            <AidProgramForm data={data} setData={setData} errors={errors} />

                            <div className="mt-6 flex gap-3">
                                <button type="submit" disabled={processing} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50">
                                    Update Program
                                </button>
                                <Link href={route('aid-programs.index')} className="rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200">
                                    Cancel
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Sidebar>
    );
}