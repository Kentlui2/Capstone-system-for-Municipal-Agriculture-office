import InputError from '@/Components/InputError';
import AuthBrandPanel from '@/Components/AuthBrandPanel';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status, stats }) {
    const { data, setData, post, processing, errors } = useForm({ email: '' });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    const statList = [
        { label: 'Profiles', value: stats.profiles },
        { label: 'Distributions', value: stats.distributions },
        { label: 'Active Programs', value: stats.active_programs },
    ];

    return (
        <>
            <Head title="Forgot Password" />

            <div className="flex min-h-screen w-full flex-col bg-[#FAF8F3] lg:flex-row">
                <AuthBrandPanel
                    eyebrow="Regain Access"
                    headline={<>Lost the key,<br />not the <em className="italic text-[#D9A441]">record</em>.</>}
                    mobileHeadline={<>Lost the key, not the <em className="italic text-[#D9A441]">record</em>.</>}
                    tagline="We'll send a reset link to your registered email — your data stays exactly where you left it."
                    stats={statList}
                />

                <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:py-12">
                    <div className="w-full max-w-sm">
                        <h2 className="text-2xl font-medium text-[#1F2A1B]" style={{ fontFamily: "'Fraunces', serif" }}>
                            Reset your password
                        </h2>
                        <p className="mt-1 text-sm text-[#1F2A1B]/60">
                            Enter your email and we'll send a reset link.
                        </p>

                        {status && (
                            <div className="mt-5 rounded-lg border border-[#24402C]/15 bg-[#24402C]/[0.06] px-3 py-2 text-sm font-medium text-[#24402C]">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="mt-7 space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-[#1F2A1B]">Email</label>
                                <input
                                    id="email" type="email" name="email" value={data.email}
                                    autoFocus
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="mt-1.5 block w-full rounded-lg border-[#1F2A1B]/15 bg-white text-sm text-[#1F2A1B] placeholder:text-[#1F2A1B]/30 focus:border-[#24402C] focus:ring-[#24402C]/30"
                                />
                                <InputError message={errors.email} className="mt-1" />
                            </div>

                            <button
                                type="submit" disabled={processing}
                                className="mt-3 flex w-full items-center justify-center rounded-lg bg-[#24402C] px-4 py-2.5 text-sm font-medium text-[#FAF8F3] transition-colors hover:bg-[#1c3322] disabled:opacity-50"
                            >
                                {processing ? 'Sending…' : 'Email reset link'}
                            </button>
                        </form>

                        <p className="mt-8 text-center text-xs text-[#1F2A1B]/40">
                            Remembered it?{' '}
                            <Link href={route('login')} className="font-medium text-[#B5652B] hover:text-[#24402C]">
                                Back to sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}