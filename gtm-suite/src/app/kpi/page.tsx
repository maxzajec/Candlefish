'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getSuiteById, updateKpiMetrics, Suite } from '@/lib/suite-storage';
import { TrendingUp, Users, DollarSign, Activity, CheckCircle2, Save } from 'lucide-react';

const CATEGORIES = [
    { id: 'revenue', label: 'Revenue Metrics', icon: DollarSign, description: 'Track revenue achievement, retention, and lifetime value.' },
    { id: 'customerSuccess', label: 'Customer Success', icon: Users, description: 'Monitor customer retention and implementation success.' },
    { id: 'salesMarketing', label: 'Sales & Marketing', icon: TrendingUp, description: 'Analyze pipeline, conversion rates, and acquisition costs.' },
    { id: 'financial', label: 'Financial Health', icon: Activity, description: 'Oversee cash flow and gross margins.' },
    { id: 'operational', label: 'Operational Excellence', icon: CheckCircle2, description: 'Ensure milestones and support targets are met.' },
] as const;

type CategoryId = typeof CATEGORIES[number]['id'];

const METRIC_LABELS: Record<CategoryId, Record<string, string>> = {
    revenue: {
        achievement: 'Revenue Achievement (>90% of plan)',
        retentionRate: 'Revenue Retention Rate',
        cltv: 'Customer Lifetime Value Targets'
    },
    customerSuccess: {
        retention: 'Customer Retention',
        implementationSuccess: 'Implementation Success Rate'
    },
    salesMarketing: {
        pipelineDevelopment: 'Pipeline Development (>90% of plan)',
        conversionRate: 'Green Connection Conversion',
        cac: 'Customer Acquisition Cost (CAC) (<110% of plan)'
    },
    financial: {
        cashFlowPositivity: 'Cash Flow Positivity Timeline',
        grossMargin: 'Gross Margin Target'
    },
    operational: {
        milestoneAchievement: 'GTM Milestone Achievement (100% on-time)',
        productMilestones: 'Product Development Milestones',
        ticketResolution: 'Support Ticket Resolution Times'
    }
};

export default function KpiPage() {
    const searchParams = useSearchParams();
    const suiteId = searchParams.get('suiteId');

    const [suite, setSuite] = useState<Suite | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<CategoryId>('revenue');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function loadData() {
            if (suiteId) {
                const data = await getSuiteById(suiteId);
                if (data) {
                    setSuite(data);
                }
            }
            setLoading(false);
        }
        loadData();
    }, [suiteId]);

    const handleMetricChange = (key: string, value: string) => {
        if (!suite) return;

        const updatedSuite = {
            ...suite,
            kpiMetrics: {
                ...suite.kpiMetrics,
                [activeTab]: {
                    ...suite.kpiMetrics[activeTab],
                    [key]: value
                }
            }
        };
        setSuite(updatedSuite);
    };

    const handleSave = async () => {
        if (!suite) return;
        setSaving(true);
        await updateKpiMetrics(suite.id, activeTab, suite.kpiMetrics[activeTab]);
        setSaving(false);
    };

    if (loading) {
        return <div className="p-8 text-center text-muted-foreground">Loading KPIs...</div>;
    }

    if (!suite) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-foreground">Key Performance Indicators</h1>
                <p className="text-muted-foreground mt-2">Please select a suite to view KPIs.</p>
            </div>
        );
    }

    const currentMetrics = suite.kpiMetrics[activeTab];
    const currentLabels = METRIC_LABELS[activeTab];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Key Performance Indicators</h1>
                <p className="text-muted-foreground mt-1">
                    Track and assess your Go-To-Market performance.
                </p>
            </div>

            {/* Tabs */}
            <div className="flex overflow-x-auto pb-2 gap-2 border-b border-border">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveTab(cat.id)}
                        className={`px-4 py-2 rounded-t-lg font-medium text-sm whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === cat.id
                            ? 'bg-secondary text-foreground border-b-2 border-primary'
                            : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                            }`}
                    >
                        <cat.icon className="w-4 h-4" />
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="bg-secondary/50 backdrop-blur-sm border border-border rounded-xl p-6">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-semibold text-foreground">{CATEGORIES.find(c => c.id === activeTab)?.label}</h2>
                        <p className="text-muted-foreground mt-1">{CATEGORIES.find(c => c.id === activeTab)?.description}</p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(currentMetrics).map(([key, value]) => (
                        <div key={key} className="bg-background border border-border rounded-lg p-4">
                            <label className="block text-sm font-medium text-muted-foreground mb-2">
                                {currentLabels[key] || key}
                            </label>
                            <input
                                type="text"
                                value={value as string}
                                onChange={(e) => handleMetricChange(key, e.target.value)}
                                className="w-full bg-secondary/30 border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
