import { FileText, Video, Image, Download, ExternalLink } from 'lucide-react';

const resources = [
    {
        category: 'Sales Materials',
        items: [
            {
                name: 'Product One-Pager',
                type: 'PDF',
                description: 'Concise overview of product features and benefits',
                icon: FileText,
                size: '2.4 MB',
            },
            {
                name: 'Pricing Sheet',
                type: 'PDF',
                description: 'Detailed pricing tiers and package options',
                icon: FileText,
                size: '1.8 MB',
            },
            {
                name: 'Case Studies',
                type: 'PDF',
                description: 'Success stories from existing partners',
                icon: FileText,
                size: '5.2 MB',
            },
        ],
    },
    {
        category: 'Training & Demos',
        items: [
            {
                name: 'Product Demo Video',
                type: 'Video',
                description: '15-minute walkthrough of key features',
                icon: Video,
                size: '45 MB',
            },
            {
                name: 'Sales Training',
                type: 'Video',
                description: 'Best practices for selling our solution',
                icon: Video,
                size: '32 MB',
            },
        ],
    },
    {
        category: 'Marketing Assets',
        items: [
            {
                name: 'Brand Guidelines',
                type: 'PDF',
                description: 'Logo usage, colors, and brand standards',
                icon: FileText,
                size: '3.1 MB',
            },
            {
                name: 'Social Media Kit',
                type: 'ZIP',
                description: 'Pre-made graphics for social promotion',
                icon: Image,
                size: '12 MB',
            },
            {
                name: 'Email Templates',
                type: 'HTML',
                description: 'Ready-to-use email outreach templates',
                icon: FileText,
                size: '0.5 MB',
            },
        ],
    },
];

const typeColors: Record<string, string> = {
    'PDF': 'bg-red-500/20 text-red-400',
    'Video': 'bg-purple-500/20 text-purple-400',
    'ZIP': 'bg-blue-500/20 text-blue-400',
    'HTML': 'bg-green-500/20 text-green-400',
};

export default function ResourcesPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Resources</h1>
                <p className="text-muted-foreground mt-1">Marketing materials, training content, and sales tools</p>
            </div>

            <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">📚 Resource Library</h3>
                <p className="text-muted-foreground">
                    Download and use these materials to support your sales efforts. All resources are regularly updated
                    to reflect the latest product information and market positioning.
                </p>
            </div>

            {resources.map((category) => (
                <div key={category.category} className="space-y-4">
                    <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                        <span className="w-1 h-6 bg-accent rounded-full"></span>
                        {category.category}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {category.items.map((item, index) => (
                            <div
                                key={index}
                                className="bg-secondary/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:bg-secondary/70 transition-all hover:scale-[1.02] duration-200"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 rounded-lg bg-muted/30">
                                        <item.icon className="w-6 h-6 text-accent" />
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${typeColors[item.type]}`}>
                                        {item.type}
                                    </span>
                                </div>
                                <h3 className="font-semibold text-foreground mb-2">{item.name}</h3>
                                <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">{item.size}</span>
                                    <button className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors">
                                        <Download className="w-4 h-4" />
                                        Download
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <div className="bg-secondary/50 backdrop-blur-sm border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">Need something specific?</h3>
                <p className="text-muted-foreground mb-4">
                    If you need custom materials or have specific requirements for your market, our marketing team
                    can create tailored resources for you.
                </p>
                <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-4 rounded-lg transition-colors">
                    <ExternalLink className="w-4 h-4" />
                    Request Custom Materials
                </button>
            </div>
        </div>
    );
}
