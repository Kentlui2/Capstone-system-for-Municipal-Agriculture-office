import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    LayoutDashboard, Users, UserCircle, Package, HandCoins, ClipboardList,
    BarChart3, FileText, RefreshCw, LogOut, ChevronLeft, ChevronRight, Menu, X,
} from 'lucide-react';

const navItems = [
    { name: 'Dashboard', href: 'dashboard', icon: LayoutDashboard, adminOnly: false },
    { name: 'Profiles', href: 'profiles.index', icon: UserCircle, adminOnly: false },
    { name: 'Commodities', href: 'commodities.index', icon: Package, adminOnly: false },
    { name: 'Aid Programs', href: 'aid-programs.index', icon: HandCoins, adminOnly: false },
    { name: 'Record Aid', href: 'aid-distributions.index', icon: ClipboardList, adminOnly: false },
    { name: 'Analytics', href: 'analytics.index', icon: BarChart3, adminOnly: false },
    { name: 'Reports', href: 'reports.index', icon: FileText, adminOnly: false },
    { name: 'Sync Queue', href: 'offline-queue.index', icon: RefreshCw, adminOnly: false },
    { name: 'User Accounts', href: 'user-accounts.index', icon: Users, adminOnly: true },
];

export default function Sidebar({ header, children }) {
    const user = usePage().props.auth.user;
    const { flash } = usePage().props;

    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const visibleNavItems = navItems.filter((item) => !item.adminOnly || user.role === 'admin');

    return (
        <div className="flex min-h-screen bg-gray-100">

            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/30 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-gray-200 bg-white transition-all duration-200
                    ${collapsed ? 'w-20' : 'w-64'}
                    ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
            >
                {/* Logo + collapse toggle */}
                <div className="flex h-16 items-center justify-between border-b border-gray-100 px-4">
                    {!collapsed && (
                        <span className="truncate text-sm font-semibold text-gray-800">MAO System</span>
                    )}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="hidden rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 lg:block"
                    >
                        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                    </button>
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="rounded p-1.5 text-gray-400 hover:bg-gray-100 lg:hidden"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Nav items */}
                <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
                    {visibleNavItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = route().current(item.href.replace('.index', '') + '*') || route().current(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={route(item.href)}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
                                    ${isActive
                                        ? 'bg-green-50 text-green-700'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                                title={collapsed ? item.name : undefined}
                            >
                                <Icon className="h-5 w-5 shrink-0" />
                                {!collapsed && <span className="truncate">{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* User menu at bottom */}
                <div className="border-t border-gray-100 p-3">
                    {!collapsed ? (
                        <div className="mb-2 px-2">
                            <p className="truncate text-sm font-medium text-gray-800">{user.name}</p>
                            <p className="truncate text-xs text-gray-500">{user.email}</p>
                        </div>
                    ) : null}
                    <div className="space-y-1">
                        <Link
                            href={route('profile.edit')}
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                            title={collapsed ? 'Profile' : undefined}
                        >
                            <UserCircle className="h-5 w-5 shrink-0" />
                            {!collapsed && <span>Profile</span>}
                        </Link>
                        <button
                            onClick={() => router.post(route('logout'))}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                            title={collapsed ? 'Log Out' : undefined}
                        >
                            <LogOut className="h-5 w-5 shrink-0" />
                            {!collapsed && <span>Log Out</span>}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main content area */}
            <div className={`flex flex-1 flex-col transition-all duration-200 ${collapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>

                {/* Top bar (mobile hamburger + page header) */}
                <div className="sticky top-0 z-30 border-b border-gray-200 bg-white">
                    <div className="flex h-16 items-center gap-4 px-4 sm:px-6 lg:px-8">
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="rounded p-1.5 text-gray-500 hover:bg-gray-100 lg:hidden"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                        {header && <div className="flex-1">{header}</div>}
                    </div>
                </div>

                {flash.success && (
                    <div className="px-4 pt-4 sm:px-6 lg:px-8">
                        <div className="rounded bg-green-50 p-4 text-sm text-green-800">{flash.success}</div>
                    </div>
                )}

                {flash.error && (
                    <div className="px-4 pt-4 sm:px-6 lg:px-8">
                        <div className="rounded bg-red-50 p-4 text-sm text-red-800">{flash.error}</div>
                    </div>
                )}

                <main className="flex-1">{children}</main>
            </div>
        </div>
    );
}