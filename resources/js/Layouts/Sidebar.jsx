import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { getDB } from '@/offline/db';
import {
    LayoutDashboard, Users, UserCircle, Package, HandCoins, ClipboardList,
    BarChart3, FileText, RefreshCw, LogOut, ChevronLeft, ChevronRight, Menu, X,
    Sprout
} from 'lucide-react';

const navSections = [
    {
        title: 'Overview',
        items: [
            { name: 'Dashboard', href: 'dashboard', activeMatch: 'dashboard', icon: LayoutDashboard, adminOnly: false },
        ]
    },
    {
        title: 'Registries',
        items: [
            { name: 'Profiles', href: 'profiles.index', activeMatch: 'profiles*', icon: UserCircle, adminOnly: false },
            { name: 'Commodities', href: 'commodities.index', activeMatch: 'commodities*', icon: Package, adminOnly: false },
        ]
    },
    {
        title: 'Operations',
        items: [
            { name: 'Aid Programs', href: 'aid-programs.index', activeMatch: 'aid-programs*', icon: HandCoins, adminOnly: false },
            { name: 'Record Aid', href: 'aid-distributions.index', activeMatch: 'aid-distributions*', icon: ClipboardList, adminOnly: false },
            { name: 'Sync Queue', href: 'offline-queue.index', activeMatch: 'offline-queue*', icon: RefreshCw, adminOnly: false },
        ]
    },
    {
        title: 'Insights',
        items: [
            { name: 'Analytics', href: 'analytics.index', activeMatch: 'analytics*', icon: BarChart3, adminOnly: false },
            { name: 'Reports', href: 'reports.index', activeMatch: 'reports*', icon: FileText, adminOnly: false },
        ]
    },
    {
        title: 'System',
        items: [
            { name: 'User Accounts', href: 'user-accounts.index', activeMatch: 'user-accounts*', icon: Users, adminOnly: true },
        ]
    }
];

export default function Sidebar({ header, children }) {
    const user = usePage().props.auth.user;
    const { flash } = usePage().props;

    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
    const [pendingCount, setPendingCount] = useState(0);

    useEffect(() => {
        const updateOnlineStatus = () => setIsOnline(navigator.onLine);
        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);

        const checkPendingQueue = async () => {
            try {
                const db = await getDB();
                const profiles = await db.getAll('pending_profiles');
                const dists = await db.getAll('pending_distributions');
                const pendingProfiles = profiles.filter((p) => p.status === 'pending_sync');
                const pendingDists = dists.filter((d) => d.status === 'pending_sync');
                setPendingCount(pendingProfiles.length + pendingDists.length);
            } catch (e) {
                // DB not ready or ignore
            }
        };

        checkPendingQueue();
        const interval = setInterval(checkPendingQueue, 5000);

        return () => {
            window.removeEventListener('online', updateOnlineStatus);
            window.removeEventListener('offline', updateOnlineStatus);
            clearInterval(interval);
        };
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-50/60">

            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-900/40 backdrop-blur-xs lg:hidden transition-opacity"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-gray-200/80 bg-white shadow-xs transition-all duration-200
                    ${collapsed ? 'w-20' : 'w-64'}
                    ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
            >
                {/* Logo + collapse toggle */}
                <div className={`flex h-16 items-center border-b border-gray-100 px-4 ${collapsed ? 'justify-center' : 'justify-between'}`}>
                    {!collapsed ? (
                        <>
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xs">
                                    <Sprout className="h-5 w-5" />
                                </div>
                                <div className="flex flex-col truncate">
                                    <span className="truncate text-sm font-bold text-gray-900 tracking-tight">MAO System</span>
                                    <span className="truncate text-[10px] font-medium text-gray-500">Agri-Office Portal</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setCollapsed(true)}
                                className="hidden rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 lg:block transition-colors"
                                title="Collapse sidebar"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setCollapsed(false)}
                            className="group relative hidden h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xs hover:from-emerald-600 hover:to-teal-700 transition-all lg:flex"
                            title="Expand sidebar"
                        >
                            <Sprout className="h-5 w-5 group-hover:hidden" />
                            <ChevronRight className="hidden h-5 w-5 group-hover:block" />
                        </button>
                    )}
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 lg:hidden"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation Sections */}
                <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-4">
                    {navSections.map((section) => {
                        const visibleItems = section.items.filter(
                            (item) => !item.adminOnly || user.role === 'admin'
                        );

                        if (visibleItems.length === 0) return null;

                        return (
                            <div key={section.title} className="space-y-1">
                                {!collapsed ? (
                                    <h3 className="px-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                        {section.title}
                                    </h3>
                                ) : (
                                    <div className="my-2 border-t border-gray-100" />
                                )}

                                {visibleItems.map((item) => {
                                    const Icon = item.icon;
                                    const matchPattern = item.activeMatch || item.href;
                                    const isActive = route().current(matchPattern) || route().current(item.href);

                                    return (
                                        <Link
                                            key={item.href}
                                            href={route(item.href)}
                                            className={`flex items-center gap-3 rounded-lg py-2.5 text-sm font-medium transition-all ${
                                                collapsed ? 'justify-center px-0' : 'px-3'
                                            } ${
                                                isActive
                                                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                                                    : 'text-gray-600 hover:bg-gray-100/70 hover:text-gray-900'
                                            }`}
                                            title={collapsed ? item.name : undefined}
                                        >
                                            <Icon className={`h-5 w-5 shrink-0 transition-colors ${isActive ? 'text-emerald-600' : 'text-gray-500'}`} />
                                            {!collapsed && <span className="truncate">{item.name}</span>}
                                        </Link>
                                    );
                                })}
                            </div>
                        );
                    })}
                </nav>

                {/* User Menu Footer */}
                <div className="border-t border-gray-100 p-3">
                    {!collapsed ? (
                        <div className="mb-3 flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-2.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white shadow-xs">
                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-xs font-semibold text-gray-900">{user.name}</p>
                                <p className="truncate text-[10px] font-medium capitalize text-gray-500">{user.role || 'User'}</p>
                            </div>
                        </div>
                    ) : null}

                    <div className="space-y-1">
                        <Link
                            href={route('profile.edit')}
                            className={`flex items-center gap-3 rounded-lg py-2 text-sm font-medium transition-colors ${
                                collapsed ? 'justify-center px-0' : 'px-3'
                            } ${
                                route().current('profile.edit')
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'text-gray-600 hover:bg-gray-100/70 hover:text-gray-900'
                            }`}
                            title={collapsed ? 'Profile' : undefined}
                        >
                            <UserCircle className="h-5 w-5 shrink-0 text-gray-500" />
                            {!collapsed && <span>Profile Settings</span>}
                        </Link>
                        <button
                            onClick={() => router.post(route('logout'))}
                            className={`flex w-full items-center gap-3 rounded-lg py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors ${
                                collapsed ? 'justify-center px-0' : 'px-3'
                            }`}
                            title={collapsed ? 'Log Out' : undefined}
                        >
                            <LogOut className="h-5 w-5 shrink-0 text-red-500" />
                            {!collapsed && <span>Log Out</span>}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main content area */}
            <div className={`flex flex-1 flex-col transition-all duration-200 ${collapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>

                {/* Top bar (mobile hamburger + page header + status indicator) */}
                <div className="sticky top-0 z-30 border-b border-gray-200/80 bg-white/95 backdrop-blur-xs">
                    <div className="flex h-16 items-center gap-4 px-4 sm:px-6 lg:px-8">
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 lg:hidden"
                        >
                            <Menu className="h-6 w-6" />
                        </button>

                        {header && <div className="flex-1">{header}</div>}

                        {/* Connectivity & Offline Sync Status Indicator */}
                        <div className="flex items-center gap-2">
                            {isOnline ? (
                                pendingCount === 0 ? (
                                    <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800 shadow-2xs">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                        </span>
                                        <span className="hidden sm:inline">Online</span>
                                    </div>
                                ) : (
                                    <Link
                                        href={route('offline-queue.index')}
                                        className="flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800 shadow-2xs hover:bg-amber-100 transition-colors"
                                    >
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                        </span>
                                        <span>Syncing ({pendingCount})</span>
                                    </Link>
                                )
                            ) : (
                                <Link
                                    href={route('offline-queue.index')}
                                    className="flex items-center gap-2 rounded-full border border-amber-300 bg-amber-100 px-3 py-1 text-xs font-medium text-amber-900 shadow-2xs hover:bg-amber-200 transition-colors"
                                >
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600"></span>
                                    </span>
                                    <span>Offline {pendingCount > 0 ? `(${pendingCount} queued)` : ''}</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {flash?.success && (
                    <div className="px-4 pt-4 sm:px-6 lg:px-8">
                        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-800 shadow-xs">
                            {flash.success}
                        </div>
                    </div>
                )}

                {flash?.error && (
                    <div className="px-4 pt-4 sm:px-6 lg:px-8">
                        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800 shadow-xs">
                            {flash.error}
                        </div>
                    </div>
                )}

                <main className="flex-1">{children}</main>
            </div>
        </div>
    );
}