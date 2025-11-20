import { TrendingUp, Users, Target, CheckCircle2 } from 'lucide-react';

const stats = [
    { label: 'Total Contacts', value: '127', change: '+12%', icon: Users, color: 'text-blue-400' },
    { label: 'Reached Out', value: '84', change: '+8%', icon: CheckCircle2, color: 'text-green-400' },
    { label: 'Active Leads', value: '23', change: '+5%', icon: Target, color: 'text-purple-400' },
    { label: 'Conversion Rate', value: '18%', change: '+3%', icon: TrendingUp, color: 'text-orange-400' },
];

const recentActivity = [
    { action: 'Added contact', name: 'John Smith - ABC Corp', time: '2 hours ago' },
    { action: 'Reached out to', name: 'Sarah Johnson - XYZ Inc', time: '5 hours ago' },
    { action: 'Updated status', name: 'Mike Davis - Tech Solutions', time: '1 day ago' },
    { action: 'Added note to', name: 'Emily Chen - Global Enterprises', time: '2 days ago' },
];

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground mt-1">Welcome back! Here's your GTM overview.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-secondary/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:bg-secondary/70 transition-all hover:scale-105 duration-200"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                                <p className="text-3xl font-bold mt-2 text-foreground">{stat.value}</p>
                                <p className="text-sm text-green-400 mt-1">{stat.change} this week</p>
                            </div>
                            <div className={`p-3 rounded-lg bg-muted/30 ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <div className="bg-secondary/50 backdrop-blur-sm border border-border rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-4 text-foreground">Recent Activity</h2>
                    <div className="space-y-4">
                        {recentActivity.map((activity, index) => (
                            <div key={index} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                                <div className="w-2 h-2 rounded-full bg-accent mt-2"></div>
                                <div className="flex-1">
                                    <p className="text-sm text-foreground">
                                        <span className="text-muted-foreground">{activity.action}</span>{' '}
                                        <span className="font-medium">{activity.name}</span>
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-secondary/50 backdrop-blur-sm border border-border rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-4 text-foreground">Quick Actions</h2>
                    <div className="space-y-3">
                        <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-4 rounded-lg transition-colors text-left">
                            + Add New Contact
                        </button>
                        <button className="w-full bg-muted/50 hover:bg-muted text-foreground font-medium py-3 px-4 rounded-lg transition-colors text-left">
                            View All Contacts
                        </button>
                        <button className="w-full bg-muted/50 hover:bg-muted text-foreground font-medium py-3 px-4 rounded-lg transition-colors text-left">
                            Browse Resources
                        </button>
                        <button className="w-full bg-muted/50 hover:bg-muted text-foreground font-medium py-3 px-4 rounded-lg transition-colors text-left">
                            Check FAQs
                        </button>
                    </div>
                </div>
            </div>

            {/* Tips Section */}
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">💡 Pro Tip</h3>
                <p className="text-muted-foreground">
                    Keep your CRM updated daily to track your outreach progress. Consistent follow-ups increase conversion rates by up to 40%!
                </p>
            </div>
        </div>
    );
}
