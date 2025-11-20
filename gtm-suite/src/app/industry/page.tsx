import { Building2, TrendingUp, Users, Award } from 'lucide-react';

const industryPlayers = [
    {
        id: '1',
        name: 'Market Leader Corp',
        category: 'Enterprise',
        marketShare: '28%',
        employees: '50,000+',
        description: 'Leading provider in the industry with comprehensive solutions',
        strengths: ['Brand Recognition', 'Global Reach', 'R&D Investment'],
    },
    {
        id: '2',
        name: 'Innovation Tech',
        category: 'Technology',
        marketShare: '15%',
        employees: '10,000+',
        description: 'Fast-growing tech company disrupting traditional models',
        strengths: ['Innovation', 'Agile', 'Customer-Centric'],
    },
    {
        id: '3',
        name: 'Regional Solutions Inc',
        category: 'Regional',
        marketShare: '8%',
        employees: '5,000+',
        description: 'Strong regional presence with specialized offerings',
        strengths: ['Local Expertise', 'Personalized Service', 'Competitive Pricing'],
    },
    {
        id: '4',
        name: 'Emerging Ventures',
        category: 'Startup',
        marketShare: '3%',
        employees: '500+',
        description: 'New entrant with innovative approach and modern technology',
        strengths: ['Cutting-Edge Tech', 'Flexible', 'Rapid Growth'],
    },
];

const categoryColors: Record<string, string> = {
    'Enterprise': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Technology': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'Regional': 'bg-green-500/20 text-green-400 border-green-500/30',
    'Startup': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
};

export default function IndustryPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Industry Players</h1>
                <p className="text-muted-foreground mt-1">Key competitors and market leaders in your vertical</p>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-secondary/50 backdrop-blur-sm border border-border rounded-xl p-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-lg bg-blue-500/20">
                            <Building2 className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Players</p>
                            <p className="text-2xl font-bold text-foreground">{industryPlayers.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-secondary/50 backdrop-blur-sm border border-border rounded-xl p-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-lg bg-green-500/20">
                            <TrendingUp className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Market Coverage</p>
                            <p className="text-2xl font-bold text-foreground">54%</p>
                        </div>
                    </div>
                </div>
                <div className="bg-secondary/50 backdrop-blur-sm border border-border rounded-xl p-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-lg bg-purple-500/20">
                            <Award className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Categories</p>
                            <p className="text-2xl font-bold text-foreground">4</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Players Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {industryPlayers.map((player) => (
                    <div
                        key={player.id}
                        className="bg-secondary/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:bg-secondary/70 transition-all hover:scale-[1.02] duration-200"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-xl font-semibold text-foreground">{player.name}</h3>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border mt-2 ${categoryColors[player.category]}`}>
                                    {player.category}
                                </span>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-muted-foreground">Market Share</p>
                                <p className="text-2xl font-bold text-accent">{player.marketShare}</p>
                            </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-4">{player.description}</p>

                        <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                            <Users className="w-4 h-4" />
                            <span>{player.employees} employees</span>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-foreground mb-2">Key Strengths:</p>
                            <div className="flex flex-wrap gap-2">
                                {player.strengths.map((strength, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-muted/30 text-muted-foreground rounded-full text-xs"
                                    >
                                        {strength}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Competitive Insights */}
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">🎯 Competitive Positioning</h3>
                <p className="text-muted-foreground">
                    Focus on your unique value proposition when competing against established players. Emphasize personalized service,
                    flexibility, and innovative solutions that larger competitors can't match.
                </p>
            </div>
        </div>
    );
}
