import { Bell, Search } from 'lucide-react';

export function Header() {
    return (
        <header className="h-16 bg-background/50 backdrop-blur-md border-b border-border sticky top-0 z-10 px-6 flex items-center justify-between ml-64">
            <div className="flex items-center gap-4 w-full max-w-md">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search contacts, companies, or resources..."
                        className="w-full bg-secondary/50 border border-border rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
                    />
                </div>
            </div>
            <div className="flex items-center gap-4">
                <button className="p-2 rounded-full hover:bg-muted/50 transition-colors relative">
                    <Bell className="w-5 h-5 text-muted-foreground" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-background"></span>
                </button>
            </div>
        </header>
    );
}
