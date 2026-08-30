import Sidebar from '@/Layouts/Sidebar';
import CommodityForm from './Partials/CommodityForm';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        category: 'Crops',
        status: 'active',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('commodities.store'));
    };

    return (
        <Sidebar header={<h2 className="text-xl font-semibold text-gray-800">Add Commodity</h2>}>
            <Head title="Add Commodity" />

            <div className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-xl">
                    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                        <form onSubmit={submit}>
                            <CommodityForm data={data} setData={setData} errors={errors} />

                            <div className="mt-6 flex gap-3">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                                >
                                    Save Commodity
                                </button>
                                <Link
                                    href={route('commodities.index')}
                                    className="rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                                >
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