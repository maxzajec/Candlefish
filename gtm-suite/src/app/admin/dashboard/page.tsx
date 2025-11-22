import { getSuites } from '@/lib/suite-storage';
import { Building2, Users, ArrowRight, LogOut, Plus } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboardPage() {
    const suites = await getSuites();

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
                        <p className="text-muted-foreground mt-1">Manage your GTM Suites</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/suites/new"
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Create New Suite
                        </Link>
                        <Link
                            href="/admin/login"
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground bg-secondary/50 hover:bg-secondary rounded-lg transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </Link>
                    </div>
                </div>

                {/* Suites Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {suites.map((suite) => (
                        <Link
                            key={suite.id}
                            href={`/dashboard?suiteId=${suite.id}`}
                            className="group block bg-secondary/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:bg-secondary/70 transition-all hover:scale-[1.02] duration-200"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${suite.status === 'active'
                                    ? 'bg-green-500/10 text-green-500'
                                    : 'bg-yellow-500/10 text-yellow-500'
                                    }`}>
                                    {suite.status.toUpperCase()}
                                </span>
                            </div>

                            <h3 className="text-xl font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                                {suite.name}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">Owner: {suite.owner}</p>
                            <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{suite.description}</p>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground border-t border-border pt-4">
                                <div className="flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    <span>{suite.stats.contacts} Contacts</span>
                                </div>
                                <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
