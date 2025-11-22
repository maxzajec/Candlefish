import Link from 'next/link';
import { LayoutDashboard, Users, Building2, HelpCircle, FileText, MessageSquare } from 'lucide-react';

const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'CRM', href: '/crm', icon: Users },
    { name: 'Industry Players', href: '/industry', icon: Building2 },
    { name: 'Resources', href: '/resources', icon: FileText },
    // { name: 'Analytics', href: '/analytics', icon: BarChart3 }, // Future
    // { name: 'Calendar', href: '/calendar', icon: Calendar }, // Future
    { name: 'FAQ', href: '/faq', icon: HelpCircle },
    { name: 'Support', href: '/support', icon: MessageSquare },
];

export function Sidebar() {
    return (
        <aside className="w-64 bg-secondary border-r border-border h-screen flex flex-col fixed left-0 top-0 text-secondary-foreground">
            <div className="p-6 border-b border-border">
                <h1 className="text-2xl font-bold text-primary">GTM Suite</h1>
                <p className="text-xs text-muted-foreground mt-1">Owner Operator Edition</p>
            </div>
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted/50 transition-colors text-sm font-medium"
                    >
                        <item.icon className="w-5 h-5 text-accent" />
                        {item.name}
                    </Link>
                ))}
            </nav>
            <div className="p-4 border-t border-border">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <span className="font-bold text-primary">OP</span>
                    </div>
                    <div>
                        <p className="text-sm font-medium">Operator</p>
                        <p className="text-xs text-muted-foreground">View Profile</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
