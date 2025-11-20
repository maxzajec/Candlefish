'use client';

import { useState } from 'react';
import { Plus, Search, Filter, Mail, Phone, Building2, Calendar } from 'lucide-react';

type ContactStatus = 'to-contact' | 'reached-out' | 'follow-up' | 'closed';

interface Contact {
    id: string;
    name: string;
    company: string;
    email: string;
    phone: string;
    status: ContactStatus;
    lastContact?: string;
    notes?: string;
}

const initialContacts: Contact[] = [
    {
        id: '1',
        name: 'John Smith',
        company: 'ABC Corporation',
        email: 'john.smith@abc.com',
        phone: '(555) 123-4567',
        status: 'reached-out',
        lastContact: '2025-11-15',
        notes: 'Interested in Q1 partnership'
    },
    {
        id: '2',
        name: 'Sarah Johnson',
        company: 'XYZ Industries',
        email: 'sarah.j@xyz.com',
        phone: '(555) 234-5678',
        status: 'follow-up',
        lastContact: '2025-11-18',
        notes: 'Schedule demo call'
    },
    {
        id: '3',
        name: 'Mike Davis',
        company: 'Tech Solutions Inc',
        email: 'mdavis@techsol.com',
        phone: '(555) 345-6789',
        status: 'to-contact',
    },
    {
        id: '4',
        name: 'Emily Chen',
        company: 'Global Enterprises',
        email: 'e.chen@global.com',
        phone: '(555) 456-7890',
        status: 'closed',
        lastContact: '2025-11-10',
        notes: 'Deal finalized'
    },
];

const statusColors: Record<ContactStatus, string> = {
    'to-contact': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'reached-out': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'follow-up': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'closed': 'bg-green-500/20 text-green-400 border-green-500/30',
};

const statusLabels: Record<ContactStatus, string> = {
    'to-contact': 'To Contact',
    'reached-out': 'Reached Out',
    'follow-up': 'Follow Up',
    'closed': 'Closed',
};

export default function CRMPage() {
    const [contacts, setContacts] = useState<Contact[]>(initialContacts);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<ContactStatus | 'all'>('all');
    const [showAddModal, setShowAddModal] = useState(false);

    const filteredContacts = contacts.filter(contact => {
        const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact.company.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === 'all' || contact.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">CRM</h1>
                    <p className="text-muted-foreground mt-1">Manage your contacts and outreach</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Add Contact
                </button>
            </div>

            {/* Filters */}
            <div className="bg-secondary/50 backdrop-blur-sm border border-border rounded-xl p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search contacts or companies..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-muted-foreground" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as ContactStatus | 'all')}
                            className="bg-background border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                        >
                            <option value="all">All Status</option>
                            <option value="to-contact">To Contact</option>
                            <option value="reached-out">Reached Out</option>
                            <option value="follow-up">Follow Up</option>
                            <option value="closed">Closed</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(statusLabels).map(([status, label]) => {
                    const count = contacts.filter(c => c.status === status).length;
                    return (
                        <div key={status} className="bg-secondary/50 border border-border rounded-lg p-4">
                            <p className="text-sm text-muted-foreground">{label}</p>
                            <p className="text-2xl font-bold mt-1 text-foreground">{count}</p>
                        </div>
                    );
                })}
            </div>

            {/* Contacts List */}
            <div className="bg-secondary/50 backdrop-blur-sm border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/30 border-b border-border">
                            <tr>
                                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Company</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Contact</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Last Contact</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredContacts.map((contact) => (
                                <tr key={contact.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                                    <td className="py-4 px-4">
                                        <p className="font-medium text-foreground">{contact.name}</p>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Building2 className="w-4 h-4" />
                                            <span className="text-sm">{contact.company}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Mail className="w-3 h-3" />
                                                <span>{contact.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Phone className="w-3 h-3" />
                                                <span>{contact.phone}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusColors[contact.status]}`}>
                                            {statusLabels[contact.status]}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        {contact.lastContact && (
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Calendar className="w-3 h-3" />
                                                <span>{contact.lastContact}</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-4 px-4">
                                        <p className="text-sm text-muted-foreground max-w-xs truncate">{contact.notes || '—'}</p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {filteredContacts.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No contacts found matching your criteria.</p>
                </div>
            )}
        </div>
    );
}
