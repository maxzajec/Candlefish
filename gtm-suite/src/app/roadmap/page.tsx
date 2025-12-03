'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getSuiteById, updateRoadmapStage, Suite, RoadmapStage, RoadmapFile } from '@/lib/suite-storage';
import { FileText, Upload, Save } from 'lucide-react';

// Since this is a client component, we need to fetch data on mount or receive it as props.
// However, getSuiteById is a server action, so we can call it directly.
// But useSearchParams is only available in Client Components (or Server Components with some caveats).
// Let's make this a Client Component that fetches data.

const STAGES = [
    { id: 'clientIntake', label: 'Client Intake Form', description: 'Initial analysis and requirements gathering.' },
    { id: 'networkAssessment', label: 'Network Assessment', description: 'Assessing the strength of the operator\'s network.' },
    { id: 'financialModeling', label: 'Financial Modeling & Terms', description: 'Revenue forecasts and operator agreements.' },
    { id: 'kpi', label: 'KPIs', description: 'Specific performance indicators for the partnership.' },
    { id: 'otherDocuments', label: 'Other Documents', description: 'Miscellaneous files and notes.' },
] as const;

type StageId = typeof STAGES[number]['id'];

export default function RoadmapPage() {
    const searchParams = useSearchParams();
    const suiteId = searchParams.get('suiteId');

    const [suite, setSuite] = useState<Suite | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<StageId>('clientIntake');
    const [notes, setNotes] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function loadData() {
            if (suiteId) {
                const data = await getSuiteById(suiteId);
                if (data) {
                    setSuite(data);
                    setNotes(data.roadmap.clientIntake.notes);
                }
            }
            setLoading(false);
        }
        loadData();
    }, [suiteId]);

    const handleTabChange = (tabId: StageId) => {
        setActiveTab(tabId);
        if (suite) {
            setNotes(suite.roadmap[tabId].notes);
        }
    };

    const handleFileUpload = async () => {
        if (!suite) return;

        // Mock file upload
        const newFile: RoadmapFile = {
            id: `file-${Date.now()}`,
            name: `Document_${new Date().toLocaleDateString()}.pdf`,
            url: '#',
            uploadedBy: 'User', // In real app, get current user
            date: new Date().toLocaleDateString()
        };

        const currentStage = suite.roadmap[activeTab];
        const updatedFiles = [...currentStage.files, newFile];

        // Optimistic update
        const updatedSuite = {
            ...suite,
            roadmap: {
                ...suite.roadmap,
                [activeTab]: {
                    ...currentStage,
                    files: updatedFiles
                }
            }
        };
        setSuite(updatedSuite);

        // Persist
        await updateRoadmapStage(suite.id, activeTab, { files: updatedFiles });
    };

    const handleSaveNotes = async () => {
        if (!suite) return;
        setSaving(true);

        // Optimistic update
        const updatedSuite = {
            ...suite,
            roadmap: {
                ...suite.roadmap,
                [activeTab]: {
                    ...suite.roadmap[activeTab],
                    notes: notes
                }
            }
        };
        setSuite(updatedSuite);

        await updateRoadmapStage(suite.id, activeTab, { notes: notes });
        setSaving(false);
    };

    const handleStatusChange = async (status: RoadmapStage['status']) => {
        if (!suite) return;

        // Optimistic update
        const updatedSuite = {
            ...suite,
            roadmap: {
                ...suite.roadmap,
                [activeTab]: {
                    ...suite.roadmap[activeTab],
                    status: status
                }
            }
        };
        setSuite(updatedSuite);

        await updateRoadmapStage(suite.id, activeTab, { status: status });
    };

    if (loading) {
        return <div className="p-8 text-center text-muted-foreground">Loading roadmap...</div>;
    }

    if (!suite) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-foreground">GTM Roadmap</h1>
                <p className="text-muted-foreground mt-2">Please select a suite to view the roadmap.</p>
            </div>
        );
    }

    const currentStageData = suite.roadmap[activeTab];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">GTM Roadmap</h1>
                <p className="text-muted-foreground mt-1">
                    Track progress from exploratory call to market launch.
                </p>
            </div>

            {/* Tabs */}
            <div className="flex overflow-x-auto pb-2 gap-2 border-b border-border">
                {STAGES.map((stage) => (
                    <button
                        key={stage.id}
                        onClick={() => handleTabChange(stage.id)}
                        className={`px-4 py-2 rounded-t-lg font-medium text-sm whitespace-nowrap transition-colors ${activeTab === stage.id
                            ? 'bg-secondary text-foreground border-b-2 border-primary'
                            : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                            }`}
                    >
                        {stage.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Header Card */}
                    <div className="bg-secondary/50 backdrop-blur-sm border border-border rounded-xl p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-xl font-semibold text-foreground">{STAGES.find(s => s.id === activeTab)?.label}</h2>
                                <p className="text-muted-foreground mt-1">{STAGES.find(s => s.id === activeTab)?.description}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Status:</span>
                                <select
                                    value={currentStageData.status}
                                    onChange={(e) => handleStatusChange(e.target.value as RoadmapStage['status'])}
                                    className="bg-background border border-border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Files Section */}
                    <div className="bg-secondary/50 backdrop-blur-sm border border-border rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                <FileText className="w-5 h-5 text-primary" />
                                Files & Materials
                            </h3>
                            <button
                                onClick={handleFileUpload}
                                className="flex items-center gap-2 px-3 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-lg transition-colors"
                            >
                                <Upload className="w-4 h-4" />
                                Upload File
                            </button>
                        </div>

                        {currentStageData.files.length === 0 ? (
                            <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
                                <p className="text-muted-foreground text-sm">No files uploaded yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {currentStageData.files.map((file) => (
                                    <div key={file.id} className="flex items-center justify-between p-3 bg-background border border-border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-muted rounded-md">
                                                <FileText className="w-4 h-4 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-foreground">{file.name}</p>
                                                <p className="text-xs text-muted-foreground">Uploaded by {file.uploadedBy} • {file.date}</p>
                                            </div>
                                        </div>
                                        <a href={file.url} className="text-sm text-primary hover:underline">Download</a>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar: Notes */}
                <div className="bg-secondary/50 backdrop-blur-sm border border-border rounded-xl p-6 h-fit">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-foreground">Notes</h3>
                        <button
                            onClick={handleSaveNotes}
                            disabled={saving}
                            className="p-2 hover:bg-muted rounded-full transition-colors text-primary disabled:opacity-50"
                            title="Save Notes"
                        >
                            <Save className="w-5 h-5" />
                        </button>
                    </div>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full h-[300px] bg-background border border-border rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none text-sm"
                        placeholder="Add notes, comments, or requirements here..."
                    />
                    <p className="text-xs text-muted-foreground mt-2 text-right">
                        {saving ? 'Saving...' : 'Changes must be saved manually'}
                    </p>
                </div>
            </div>
        </div>
    );
}
