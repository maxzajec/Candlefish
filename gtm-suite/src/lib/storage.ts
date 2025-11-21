'use server';

import fs from 'fs/promises';
import path from 'path';

export interface Contact {
    id: string;
    name: string;
    company: string;
    email: string;
    phone: string;
    status: 'to-contact' | 'reached-out' | 'follow-up' | 'closed';
    lastContact?: string;
    notes?: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'contacts.json');

async function ensureDataDir() {
    try {
        await fs.access(DATA_DIR);
    } catch {
        await fs.mkdir(DATA_DIR, { recursive: true });
    }
}

async function readContacts(): Promise<Contact[]> {
    await ensureDataDir();
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist or is invalid, return empty array
        return [];
    }
}

async function writeContacts(contacts: Contact[]) {
    await ensureDataDir();
    await fs.writeFile(DATA_FILE, JSON.stringify(contacts, null, 2));
}

export async function getContacts(): Promise<{ contacts: Contact[], error?: string }> {
    try {
        const contacts = await readContacts();
        return { contacts };
    } catch (error) {
        console.error('Error reading contacts:', error);
        return { contacts: [], error: 'read_error' };
    }
}

export async function createContact(contact: Omit<Contact, 'id'>): Promise<boolean> {
    try {
        const contacts = await readContacts();
        const newContact = {
            ...contact,
            id: Math.random().toString(36).substring(2, 15), // Simple ID generation
            lastContact: new Date().toLocaleDateString(),
        };
        contacts.push(newContact);
        await writeContacts(contacts);
        return true;
    } catch (error) {
        console.error('Error creating contact:', error);
        return false;
    }
}

export async function updateContact(id: string, updates: Partial<Contact>): Promise<boolean> {
    try {
        const contacts = await readContacts();
        const index = contacts.findIndex(c => c.id === id);
        if (index === -1) return false;

        contacts[index] = { ...contacts[index], ...updates };
        await writeContacts(contacts);
        return true;
    } catch (error) {
        console.error('Error updating contact:', error);
        return false;
    }
}

export async function deleteContact(id: string): Promise<boolean> {
    try {
        const contacts = await readContacts();
        const filteredContacts = contacts.filter(c => c.id !== id);
        await writeContacts(filteredContacts);
        return true;
    } catch (error) {
        console.error('Error deleting contact:', error);
        return false;
    }
}
