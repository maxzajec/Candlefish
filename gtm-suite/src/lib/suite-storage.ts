'use server';

import fs from 'fs/promises';
import path from 'path';

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
        return JSON.parse(data);
    } catch {
        // Initialize with default mock data if file doesn't exist
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
