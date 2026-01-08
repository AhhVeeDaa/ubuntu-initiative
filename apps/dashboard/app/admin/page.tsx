import { getCurrentAdminRole } from '@/lib/auth/permissions';
import { redirect } from 'next/navigation';
import { Shield, Users, Activity, Settings } from 'lucide-react';

export default async function AdminDashboard() {
    const role = await getCurrentAdminRole();

    if (!role) {
        redirect('/admin/login');
    }

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
                <p className="text-slate-400">Welcome back. You are logged in as <span className="text-teal-400 font-mono bg-teal-950 px-2 py-0.5 rounded">{role}</span>.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Quick Stats / Cards based on role */}
                <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-500/20 rounded-lg">
                            <Users className="w-6 h-6 text-blue-400" />
                        </div>
                        <h3 className="font-semibold text-slate-200">User Management</h3>
                    </div>
                    <p className="text-sm text-slate-500 mb-4">Manage admin access and roles.</p>
                    <button className="text-sm text-blue-400 hover:text-blue-300 font-medium">View Users &rarr;</button>
                </div>

                <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-teal-500/20 rounded-lg">
                            <Activity className="w-6 h-6 text-teal-400" />
                        </div>
                        <h3 className="font-semibold text-slate-200">Activity Logs</h3>
                    </div>
                    <p className="text-sm text-slate-500 mb-4">Audit trail of all actions.</p>
                    <button className="text-sm text-teal-400 hover:text-teal-300 font-medium">View Logs &rarr;</button>
                </div>

                <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-purple-500/20 rounded-lg">
                            <Shield className="w-6 h-6 text-purple-400" />
                        </div>
                        <h3 className="font-semibold text-slate-200">Security</h3>
                    </div>
                    <p className="text-sm text-slate-500 mb-4">MFA status and policy settings.</p>
                    <button className="text-sm text-purple-400 hover:text-purple-300 font-medium">Configure &rarr;</button>
                </div>

                {role === 'super_admin' && (
                    <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-orange-500/20 rounded-lg">
                                <Settings className="w-6 h-6 text-orange-400" />
                            </div>
                            <h3 className="font-semibold text-slate-200">System Settings</h3>
                        </div>
                        <p className="text-sm text-slate-500 mb-4">Global configuration.</p>
                        <button className="text-sm text-orange-400 hover:text-orange-300 font-medium">Manage &rarr;</button>
                    </div>
                )}
            </div>
        </div>
    );
}
