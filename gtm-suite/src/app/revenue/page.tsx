import { getSuiteById } from '@/lib/suite-storage';
import { DollarSign, TrendingUp, Users, ArrowUpRight, ArrowDownRight, CreditCard } from 'lucide-react';

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function RevenuePage(props: Props) {
    const searchParams = await props.searchParams;
    const suiteId = typeof searchParams.suiteId === 'string' ? searchParams.suiteId : undefined;
    const suite = suiteId ? await getSuiteById(suiteId) : undefined;

    // Use suite data or defaults if not found (or for generic view)
    const metrics = suite?.revenueMetrics || {
        totalRevenue: 0,
        mrr: 0,
        revenueChurn: '0%',
        customerChurn: '0%',
        arpu: 0
    };

    const stats = [
        {
            label: 'Total Revenue',
            value: `$${metrics.totalRevenue.toLocaleString()}`,
            change: '+15%',
            trend: 'up',
            icon: DollarSign,
            color: 'text-green-500',
            bg: 'bg-green-500/10'
        },
        {
            label: 'Monthly Recurring Revenue (MRR)',
            value: `$${metrics.mrr.toLocaleString()}`,
            change: '+8%',
            trend: 'up',
            icon: CreditCard,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10'
        },
        {
            label: 'Avg. Revenue Per User (ARPU)',
            value: `$${metrics.arpu.toLocaleString()}`,
            change: '+2%',
            trend: 'up',
            icon: Users,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10'
        },
        {
            label: 'Revenue Churn',
            value: metrics.revenueChurn,
            change: '-0.5%',
            trend: 'down', // Down is good for churn
            icon: TrendingUp,
            color: 'text-orange-500',
            bg: 'bg-orange-500/10'
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Revenue Generation</h1>
                <p className="text-muted-foreground mt-1">
                    Track your financial performance and growth metrics.
                </p>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-secondary/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:bg-secondary/70 transition-all duration-200"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                                <h3 className="text-2xl font-bold mt-2 text-foreground">{stat.value}</h3>
                            </div>
                            <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <span className={`flex items-center gap-1 ${stat.trend === 'up' ? 'text-green-500' : 'text-green-500'}`}>
                                {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                {stat.change}
                            </span>
                            <span className="text-muted-foreground ml-2">vs last month</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts / Detailed View Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-secondary/50 backdrop-blur-sm border border-border rounded-xl p-6 min-h-[400px] flex flex-col items-center justify-center text-center">
                    <div className="p-4 rounded-full bg-muted mb-4">
                        <TrendingUp className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">Revenue Growth Chart</h3>
                    <p className="text-muted-foreground max-w-sm mt-2">
                        Visualizations for revenue trends over time will appear here once enough data is collected.
                    </p>
                </div>

                <div className="bg-secondary/50 backdrop-blur-sm border border-border rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Recent Transactions</h3>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center justify-between pb-4 border-b border-border last:border-0 last:pb-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                                        <DollarSign className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">New Subscription</p>
                                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                                    </div>
                                </div>
                                <span className="text-sm font-medium text-green-500">+$299.00</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
