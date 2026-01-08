'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Loader2, Lock, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mfaCode, setMfaCode] = useState('');
    const [step, setStep] = useState<'credentials' | 'mfa'>('credentials');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [attempts, setAttempts] = useState(0);
    const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);

    const router = useRouter();
    const supabase = createClientComponentClient();

    useEffect(() => {
        // Check for local lockout
        const storedLockout = localStorage.getItem('admin_lockout_until');
        if (storedLockout) {
            const lockoutTime = parseInt(storedLockout, 10);
            if (Date.now() < lockoutTime) {
                setLockoutUntil(lockoutTime);
            } else {
                localStorage.removeItem('admin_lockout_until');
            }
        }
    }, []);

    const handleLockout = () => {
        const lockoutTime = Date.now() + 15 * 60 * 1000; // 15 minutes
        setLockoutUntil(lockoutTime);
        localStorage.setItem('admin_lockout_until', lockoutTime.toString());
        setError('Too many failed attempts. Please try again in 15 minutes.');

        // Log failed attempt lockout
        logActivity('login_lockout', 'failure', { attempts: attempts + 1 });
    };

    const logActivity = async (action: string, status: 'success' | 'failure', details?: object) => {
        try {
            await supabase.from('admin_activity_log').insert({
                action,
                status,
                details,
                resource: 'auth',
                user_agent: window.navigator.userAgent,
            });
        } catch (err) {
            console.error('Failed to log activity', err);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (lockoutUntil && Date.now() < lockoutUntil) {
            setError(`Account locked. Try again in ${Math.ceil((lockoutUntil - Date.now()) / 60000)} minutes.`);
            return;
        }

        setLoading(true);

        try {
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) {
                setAttempts((prev) => {
                    const newAttempts = prev + 1;
                    if (newAttempts >= 5) {
                        handleLockout();
                    }
                    return newAttempts;
                });
                throw signInError;
            }

            // Check if user has admin role
            if (data.user) {
                const { data: roleData } = await supabase
                    .from('admin_roles')
                    .select('role')
                    .eq('user_id', data.user.id)
                    .eq('is_active', true)
                    .single();

                if (!roleData) {
                    await supabase.auth.signOut();
                    throw new Error('Unauthorized: No active admin role found.');
                }

                // Check for MFA enrollment
                const { data: mfaData, error: mfaError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

                if (mfaData && mfaData.nextLevel === 'aal2' && mfaData.currentLevel === 'aal1') {
                    // MFA is required/enabled but not yet verified in this session
                    setStep('mfa');
                    setLoading(false);
                    return;
                }

                // Success - Log and Redirect
                await logActivity('login', 'success', { email, role: roleData.role });
                router.push('/admin');
            }
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.message || 'Authentication failed');
            await logActivity('login', 'failure', { email, error: err.message });
        } finally {
            setLoading(false);
        }
    };

    const handleMfaVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.mfa.challengeAndVerify({
                factorId: (await supabase.auth.mfa.listFactors()).data?.totp[0].id!,
                code: mfaCode
            });

            if (error) throw error;

            await logActivity('mfa_verify', 'success');
            router.push('/admin');

        } catch (err: any) {
            setError(err.message || 'Invalid MFA code');
            await logActivity('mfa_verify', 'failure', { error: err.message });
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
            {/* Background Animated Elements (Simulating Inga Falls Mist) */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-teal-500/10 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
            </div>

            <div className="w-full max-w-md p-8 relative z-10 glass-panel rounded-2xl border border-white/10 shadow-2xl bg-black/40 backdrop-blur-xl">
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-teal-400 to-blue-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-teal-500/20">
                        <Lock className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-200 to-white">
                        Admin Portal
                    </h1>
                    <p className="text-slate-400 text-sm mt-2">Secure Access Restricted</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start gap-3 text-red-100 text-sm">
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                {step === 'credentials' ? (
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Email Address</label>
                            <input
                                type="email"
                                required
                                className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all placeholder:text-slate-500"
                                placeholder="admin@ubuntu.initiative"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading || !!lockoutUntil}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all placeholder:text-slate-500"
                                placeholder="••••••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading || !!lockoutUntil}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !!lockoutUntil}
                            className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-white font-semibold py-3 rounded-lg shadow-lg shadow-teal-900/50 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleMfaVerify} className="space-y-6">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-teal-500/20 mb-3">
                                <ShieldCheck className="w-6 h-6 text-teal-400" />
                            </div>
                            <h3 className="text-lg font-medium text-white">Two-Factor Authentication</h3>
                            <p className="text-slate-400 text-sm mt-1">Enter the 6-digit code from your authenticator app.</p>
                        </div>

                        <div>
                            <input
                                type="text"
                                maxLength={6}
                                required
                                className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-4 text-center text-2xl tracking-[0.5em] font-mono text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                                placeholder="000000"
                                value={mfaCode}
                                onChange={(e) => setMfaCode(e.target.value.replace(/[^0-9]/g, ''))}
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-white font-semibold py-3 rounded-lg shadow-lg shadow-teal-900/50 transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify Code'}
                        </button>

                        <button
                            type="button"
                            onClick={() => setStep('credentials')}
                            className="w-full text-slate-400 text-sm hover:text-white transition-colors"
                        >
                            Back to Login
                        </button>
                    </form>
                )}

                <div className="mt-8 text-center">
                    <p className="text-xs text-slate-500">
                        Unauthorized access is prohibited and monitored.
                        <br />
                        IP Address Logged.
                    </p>
                </div>
            </div>
        </div>
    );
}
