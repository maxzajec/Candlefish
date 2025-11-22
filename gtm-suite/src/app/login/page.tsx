'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authenticateOwner } from '@/lib/suite-storage';
import { Lock } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [role, setRole] = useState<'admin' | 'owner'>('owner');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (role === 'admin') {
                // Mock Admin Authentication
                if (username === 'admin' && password === 'password') {
                    router.push('/admin/dashboard');
                } else {
                    setError('Invalid admin credentials');
                }
            } else {
                // Owner Authentication
                // Note: authenticateOwner is a Server Action, so we can call it directly
                // However, since we are in a Client Component, we need to import it properly or wrap it.
                // For simplicity in this prototype, we'll assume it works or we might need to move logic to API route if Next.js complains.
                // Actually, let's use a simple API call or just mock it if we can't import server action directly here easily without setup.
                // Wait, we can import Server Actions in Client Components in Next.js 14+.

                // We need to make sure authenticateOwner is exported from a file marked 'use server'
                // suite-storage.ts has 'use server' at the top, so this should work!

                const suiteId = await authenticateOwner(username, password);
                if (suiteId) {
                    router.push(`/dashboard?suiteId=${suiteId}`);
                } else {
                    setError('Invalid owner credentials');
                }
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md space-y-6 bg-secondary/50 backdrop-blur-sm border border-border rounded-xl p-8">
                <div className="flex flex-col items-center space-y-2">
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                        <Lock className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
                    <p className="text-sm text-muted-foreground">Sign in to access your dashboard</p>
                </div>

                {/* Role Toggle */}
                <div className="flex p-1 bg-muted/50 rounded-lg">
                    <button
                        onClick={() => setRole('owner')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${role === 'owner'
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${role === 'owner' ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground'}`}>
                            {role === 'owner' && <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                        </div>
                        Owner Operator
                    </button>
                    <button
                        onClick={() => setRole('admin')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${role === 'admin'
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${role === 'admin' ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground'}`}>
                            {role === 'admin' && <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                        </div>
                        Admin
                    </button>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    {error && (
                        <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label htmlFor="username" className="text-sm font-medium text-foreground">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder={role === 'admin' ? 'admin' : 'username'}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium text-foreground">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
}
