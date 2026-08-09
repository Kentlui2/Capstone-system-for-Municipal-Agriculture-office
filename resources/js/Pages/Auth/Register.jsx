import InputError from '@/Components/InputError';
import AuthBrandPanel from '@/Components/AuthBrandPanel';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register({ stats }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const statList = [
        { label: 'Profiles', value: stats.profiles },
        { label: 'Distributions', value: stats.distributions },
        { label: 'Active Programs', value: stats.active_programs },
    ];

    return (
        <>
            <Head title="Register" />

            <div className="flex min-h-screen w-full flex-col bg-[#FAF8F3] lg:flex-row">
                <AuthBrandPanel
                    eyebrow="Join the Ledger"
                    headline={<>Your account, <em className="italic text-[#D9A441]">pending</em><br />one signature away.</>}
                    mobileHeadline={<>Your account, <em className="italic text-[#D9A441]">pending approval</em>.</>}
                    tagline="New encoder and admin accounts are reviewed before access is granted — a safeguard for public aid records."
                    stats={statList}
                />

                <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:py-12">
                    <div className="w-full max-w-sm">
                        <h2 className="text-2xl font-medium text-[#1F2A1B]" style={{ fontFamily: "'Fraunces', serif" }}>
                            Request an account
                        </h2>
                        <p className="mt-1 text-sm text-[#1F2A1B]/60">
                            An admin will review and approve your access.
                        </p>

                        <form onSubmit={submit} className="mt-7 space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-[#1F2A1B]">Full name</label>
                                <input
                                    id="name" type="text" name="name" value={data.name}
                                    autoComplete="name" autoFocus
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-1.5 block w-full rounded-lg border-[#1F2A1B]/15 bg-white text-sm text-[#1F2A1B] placeholder:text-[#1F2A1B]/30 focus:border-[#24402C] focus:ring-[#24402C]/30"
                                />
                                <InputError message={errors.name} className="mt-1" />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-[#1F2A1B]">Email</label>
                                <input
                                    id="email" type="email" name="email" value={data.email}
                                    autoComplete="username"
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="mt-1.5 block w-full rounded-lg border-[#1F2A1B]/15 bg-white text-sm text-[#1F2A1B] placeholder:text-[#1F2A1B]/30 focus:border-[#24402C] focus:ring-[#24402C]/30"
                                />
                                <InputError message={errors.email} className="mt-1" />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-[#1F2A1B]">Password</label>
                                <input
                                    id="password" type="password" name="password" value={data.password}
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="mt-1.5 block w-full rounded-lg border-[#1F2A1B]/15 bg-white text-sm text-[#1F2A1B] placeholder:text-[#1F2A1B]/30 focus:border-[#24402C] focus:ring-[#24402C]/30"
                                />
                                <InputError message={errors.password} className="mt-1" />
                            </div>

                            <div>
                                <label htmlFor="password_confirmation" className="block text-sm font-medium text-[#1F2A1B]">Confirm password</label>
                                <input
                                    id="password_confirmation" type="password" name="password_confirmation" value={data.password_confirmation}
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className="mt-1.5 block w-full rounded-lg border-[#1F2A1B]/15 bg-white text-sm text-[#1F2A1B] placeholder:text-[#1F2A1B]/30 focus:border-[#24402C] focus:ring-[#24402C]/30"
                                />
                                <InputError message={errors.password_confirmation} className="mt-1" />
                            </div>

                            <button
                                type="submit" disabled={processing}
                                className="mt-3 flex w-full items-center justify-center rounded-lg bg-[#24402C] px-4 py-2.5 text-sm font-medium text-[#FAF8F3] transition-colors hover:bg-[#1c3322] disabled:opacity-50"
                            >
                                {processing ? 'Submitting…' : 'Request access'}
                            </button>
                        </form>

                        <p className="mt-8 text-center text-xs text-[#1F2A1B]/40">
                            Already have an account?{' '}
                            <Link href={route('login')} className="font-medium text-[#B5652B] hover:text-[#24402C]">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}