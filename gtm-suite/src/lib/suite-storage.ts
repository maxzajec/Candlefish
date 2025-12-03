'use server';

import fs from 'fs/promises';
import path from 'path';

export interface RoadmapFile {
    id: string;
    name: string;
    url: string;
    uploadedBy: string;
    date: string;
}

export interface RoadmapStage {
    status: 'pending' | 'in_progress' | 'completed';
    files: RoadmapFile[];
    notes: string;
}

export interface Suite {
    id: string;
    name: string;
    owner: string;
    vertical: string;
    description: string;
    status: 'active' | 'inactive' | 'pending';
    credentials?: {
        username: string;
        password: string; // In a real app, this should be hashed!
    };
    stats: {
        contacts: number;
        reachedOut: number;
        activeLeads: number;
        conversionRate: string;
    };
    revenueMetrics: {
        totalRevenue: number;
        mrr: number;
        revenueChurn: string;
        customerChurn: string;
        arpu: number;
    };
    roadmap: {
        clientIntake: RoadmapStage;
        networkAssessment: RoadmapStage;
        financialModeling: RoadmapStage;
        kpi: RoadmapStage;
        otherDocuments: RoadmapStage;
    };
    kpiMetrics: {
        revenue: {
            achievement: string;
            retentionRate: string;
            cltv: string;
        };
        customerSuccess: {
            retention: string;
            implementationSuccess: string;
        };
        salesMarketing: {
            pipelineDevelopment: string;
            conversionRate: string;
            cac: string;
        };
        financial: {
            cashFlowPositivity: string;
            grossMargin: string;
        };
        operational: {
            milestoneAchievement: string;
            productMilestones: string;
            ticketResolution: string;
        };
    };
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'suites.json');

async function ensureDataDir() {
    try {
        await fs.access(DATA_DIR);
    } catch {
        await fs.mkdir(DATA_DIR, { recursive: true });
    }
}

async function readSuites(): Promise<Suite[]> {
    await ensureDataDir();
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        const suites: Suite[] = JSON.parse(data);

        // Migration: Add default revenue metrics, roadmap, and kpi metrics if missing
        const migratedSuites = suites.map(suite => {
            const updatedSuite = { ...suite };

            if (!updatedSuite.revenueMetrics) {
                updatedSuite.revenueMetrics = {
                    totalRevenue: 0,
                    mrr: 0,
                    revenueChurn: '0%',
                    customerChurn: '0%',
                    arpu: 0
                };
            }

            const defaultStage: RoadmapStage = {
                status: 'pending',
                files: [],
                notes: ''
            };

            if (!updatedSuite.roadmap) {
                updatedSuite.roadmap = {
                    clientIntake: { ...defaultStage },
                    networkAssessment: { ...defaultStage },
                    financialModeling: { ...defaultStage },
                    kpi: { ...defaultStage },
                    otherDocuments: { ...defaultStage }
                };
            } else if (!updatedSuite.roadmap.otherDocuments) {
                // Add otherDocuments if roadmap exists but is missing this new stage
                updatedSuite.roadmap = {
                    ...updatedSuite.roadmap,
                    otherDocuments: { ...defaultStage }
                };
            }

            if (!updatedSuite.kpiMetrics) {
                updatedSuite.kpiMetrics = {
                    revenue: { achievement: '0%', retentionRate: '0%', cltv: '$0' },
                    customerSuccess: { retention: '0%', implementationSuccess: '0%' },
                    salesMarketing: { pipelineDevelopment: '0%', conversionRate: '0%', cac: '0%' },
                    financial: { cashFlowPositivity: 'TBD', grossMargin: '0%' },
                    operational: { milestoneAchievement: '0%', productMilestones: '0%', ticketResolution: '0h' }
                };
            }

            return updatedSuite;
        });

        // If migration happened (length is same but content might differ), save it back
        // Optimization: check if any changes were made before writing
        if (JSON.stringify(suites) !== JSON.stringify(migratedSuites)) {
            await writeSuites(migratedSuites);
        }

        return migratedSuites;
    } catch {
        // Initialize with default mock data if file doesn't exist
        const defaultStage: RoadmapStage = {
            status: 'pending',
            files: [],
            notes: ''
        };

        const defaultKpiMetrics = {
            revenue: { achievement: '0%', retentionRate: '0%', cltv: '$0' },
            customerSuccess: { retention: '0%', implementationSuccess: '0%' },
            salesMarketing: { pipelineDevelopment: '0%', conversionRate: '0%', cac: '0%' },
            financial: { cashFlowPositivity: 'TBD', grossMargin: '0%' },
            operational: { milestoneAchievement: '0%', productMilestones: '0%', ticketResolution: '0h' }
        };

        const defaultSuites: Suite[] = [
            {
                id: 'suite-1',
                name: 'TechStart GTM',
                owner: 'Alice Tech',
                vertical: 'SaaS',
                description: 'GTM strategy for new SaaS product',
                status: 'active',
                credentials: {
                    username: 'alice',
                    password: '123',
                },
                stats: {
                    contacts: 127,
                    reachedOut: 84,
                    activeLeads: 23,
                    conversionRate: '18%',
                },
                revenueMetrics: {
                    totalRevenue: 15000,
                    mrr: 2500,
                    revenueChurn: '2%',
                    customerChurn: '5%',
                    arpu: 150
                },
                roadmap: {
                    clientIntake: { ...defaultStage, status: 'completed', notes: 'Initial intake completed.' },
                    networkAssessment: { ...defaultStage, status: 'in_progress' },
                    financialModeling: { ...defaultStage },
                    kpi: { ...defaultStage },
                    otherDocuments: { ...defaultStage }
                },
                kpiMetrics: {
                    ...defaultKpiMetrics,
                    revenue: { achievement: '95%', retentionRate: '98%', cltv: '$5000' }
                }
            },
            {
                id: 'suite-2',
                name: 'GreenEnergy Launch',
                owner: 'Bob Green',
                vertical: 'Clean Tech',
                description: 'Launch plan for solar initiative',
                status: 'active',
                credentials: {
                    username: 'bob',
                    password: '123',
                },
                stats: {
                    contacts: 45,
                    reachedOut: 12,
                    activeLeads: 5,
                    conversionRate: '8%',
                },
                revenueMetrics: {
                    totalRevenue: 8000,
                    mrr: 1200,
                    revenueChurn: '1%',
                    customerChurn: '3%',
                    arpu: 200
                },
                roadmap: {
                    clientIntake: { ...defaultStage },
                    networkAssessment: { ...defaultStage },
                    financialModeling: { ...defaultStage },
                    kpi: { ...defaultStage },
                    otherDocuments: { ...defaultStage }
                },
                kpiMetrics: defaultKpiMetrics
            },
        ];
        await writeSuites(defaultSuites);
        return defaultSuites;
    }
}

async function writeSuites(suites: Suite[]) {
    await ensureDataDir();
    await fs.writeFile(DATA_FILE, JSON.stringify(suites, null, 2));
}

export async function getSuites(): Promise<Suite[]> {
    return await readSuites();
}

export async function getSuiteById(id: string): Promise<Suite | undefined> {
    const suites = await readSuites();
    return suites.find((s) => s.id === id);
}

export async function createSuite(data: Pick<Suite, 'name' | 'owner' | 'vertical' | 'description' | 'credentials'>): Promise<boolean> {
    try {
        const suites = await readSuites();
        const defaultStage: RoadmapStage = {
            status: 'pending',
            files: [],
            notes: ''
        };

        const newSuite: Suite = {
            ...data,
            id: `suite-${Date.now()}`,
            status: 'pending',
            stats: {
                contacts: 0,
                reachedOut: 0,
                activeLeads: 0,
                conversionRate: '0%',
            },
            revenueMetrics: {
                totalRevenue: 0,
                mrr: 0,
                revenueChurn: '0%',
                customerChurn: '0%',
                arpu: 0
            },
            roadmap: {
                clientIntake: { ...defaultStage },
                networkAssessment: { ...defaultStage },
                financialModeling: { ...defaultStage },
                kpi: { ...defaultStage },
                otherDocuments: { ...defaultStage }
            },
            kpiMetrics: {
                revenue: { achievement: '0%', retentionRate: '0%', cltv: '$0' },
                customerSuccess: { retention: '0%', implementationSuccess: '0%' },
                salesMarketing: { pipelineDevelopment: '0%', conversionRate: '0%', cac: '0%' },
                financial: { cashFlowPositivity: 'TBD', grossMargin: '0%' },
                operational: { milestoneAchievement: '0%', productMilestones: '0%', ticketResolution: '0h' }
            }
        };
        suites.push(newSuite);
        await writeSuites(suites);
        return true;
    } catch (error) {
        console.error('Error creating suite:', error);
        return false;
    }
}

export async function authenticateOwner(username: string, password: string): Promise<string | null> {
    const suites = await readSuites();
    const suite = suites.find(s =>
        s.credentials?.username.toLowerCase() === username.toLowerCase() &&
        s.credentials?.password === password
    );
    return suite ? suite.id : null;
}

export async function updateRoadmapStage(suiteId: string, stageKey: keyof Suite['roadmap'], data: Partial<RoadmapStage>): Promise<boolean> {
    try {
        const suites = await readSuites();
        const suiteIndex = suites.findIndex(s => s.id === suiteId);

        if (suiteIndex === -1) return false;

        const currentStage = suites[suiteIndex].roadmap[stageKey];
        suites[suiteIndex].roadmap[stageKey] = {
            ...currentStage,
            ...data
        };

        await writeSuites(suites);
        return true;
    } catch (error) {
        console.error('Error updating roadmap:', error);
        return false;
    }
}

export async function updateKpiMetrics(suiteId: string, category: keyof Suite['kpiMetrics'], data: Partial<Suite['kpiMetrics'][keyof Suite['kpiMetrics']]>): Promise<boolean> {
    try {
        const suites = await readSuites();
        const suiteIndex = suites.findIndex(s => s.id === suiteId);

        if (suiteIndex === -1) return false;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (suites[suiteIndex].kpiMetrics[category] as any) = {
            ...suites[suiteIndex].kpiMetrics[category],
            ...data
        };

        await writeSuites(suites);
        return true;
    } catch (error) {
        console.error('Error updating KPI metrics:', error);
        return false;
    }
}
