import InputError from '@/Components/InputError';
import AuthBrandPanel from '@/Components/AuthBrandPanel';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword, stats }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const statList = [
        { label: 'Profiles', value: stats.profiles },
        { label: 'Distributions', value: stats.distributions },
        { label: 'Active Programs', value: stats.active_programs },
    ];

    return (
        <>
            <Head title="Log in" />

            <div className="flex min-h-screen w-full flex-col bg-[#FAF8F3] lg:flex-row">
                <AuthBrandPanel
                    eyebrow="Field Ledger"
                    headline={<>Every farmer, every catch,<br /><em className="italic text-[#D9A441]">every hectare</em> tracked.</>}
                    mobileHeadline={<>Every farmer, every catch, <em className="italic text-[#D9A441]">tracked</em>.</>}
                    tagline="One record of profiles and aid distribution across all 18 barangays — kept honest, kept current."
                    stats={statList}
                />

                <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:py-12">
                    <div className="w-full max-w-sm">
                        <h2 className="text-2xl font-medium text-[#1F2A1B]" style={{ fontFamily: "'Fraunces', serif" }}>
                            Welcome back
                        </h2>
                        <p className="mt-1 text-sm text-[#1F2A1B]/60">
                            Sign in with your MAO account to continue.
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
                                    autoComplete="username" autoFocus
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="mt-1.5 block w-full rounded-lg border-[#1F2A1B]/15 bg-white text-sm text-[#1F2A1B] placeholder:text-[#1F2A1B]/30 focus:border-[#24402C] focus:ring-[#24402C]/30"
                                />
                                <InputError message={errors.email} className="mt-1" />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-[#1F2A1B]">Password</label>
                                <input
                                    id="password" type="password" name="password" value={data.password}
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="mt-1.5 block w-full rounded-lg border-[#1F2A1B]/15 bg-white text-sm text-[#1F2A1B] placeholder:text-[#1F2A1B]/30 focus:border-[#24402C] focus:ring-[#24402C]/30"
                                />
                                <InputError message={errors.password} className="mt-1" />
                            </div>

                            <div className="flex items-center justify-between pt-1">
                                <label className="flex items-center gap-2 text-sm text-[#1F2A1B]/70">
                                    <input
                                        type="checkbox" name="remember" checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="rounded border-[#1F2A1B]/25 text-[#24402C] focus:ring-[#24402C]/30"
                                    />
                                    Remember me
                                </label>
                                {canResetPassword && (
                                    <Link href={route('password.request')} className="text-sm font-medium text-[#24402C] hover:text-[#B5652B]">
                                        Forgot password?
                                    </Link>
                                )}
                            </div>

                            <button
                                type="submit" disabled={processing}
                                className="mt-3 flex w-full items-center justify-center rounded-lg bg-[#24402C] px-4 py-2.5 text-sm font-medium text-[#FAF8F3] transition-colors hover:bg-[#1c3322] disabled:opacity-50"
                            >
                                {processing ? 'Signing in…' : 'Sign in'}
                            </button>
                        </form>

                        <p className="mt-8 text-center text-xs text-[#1F2A1B]/40">
                            New encoder or admin?{' '}
                            <Link href={route('register')} className="font-medium text-[#B5652B] hover:text-[#24402C]">
                                Request an account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}