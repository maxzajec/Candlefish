'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Mail, Phone, Building2, Calendar, Trash2, Pencil, X } from 'lucide-react';
import { getContacts, createContact, deleteContact, updateContact, type Contact } from '@/lib/storage';

type ContactStatus = 'to-contact' | 'reached-out' | 'follow-up' | 'closed';

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
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<ContactStatus | 'all'>('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingContact, setEditingContact] = useState<Contact | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadContacts();
    }, []);

    async function loadContacts() {
        try {
            const { contacts, error } = await getContacts();
            if (error) {
                setError(error);
            } else {
                setContacts(contacts);
                setError(null);
            }
        } catch (error) {
            console.error('Failed to load contacts:', error);
            setError('unknown_error');
        } finally {
            setIsLoading(false);
        }
    }

    async function handleAddContact(formData: FormData) {
        setIsSubmitting(true);
        try {
            const contactData = {
                name: formData.get('name') as string,
                company: formData.get('company') as string,
                email: formData.get('email') as string,
                phone: formData.get('phone') as string,
                notes: formData.get('notes') as string,
                status: 'to-contact' as const,
            };

            if (editingContact) {
                const success = await updateContact(editingContact.id, contactData);
                if (success) {
                    await loadContacts();
                    setEditingContact(null);
                    setShowAddModal(false);
                } else {
                    alert('Failed to update contact');
                }
            } else {
                const success = await createContact(contactData);
                if (success) {
                    await loadContacts();
                    setShowAddModal(false);
                } else {
                    alert('Failed to create contact');
                }
            }
        } catch (error) {
            console.error('Error saving contact:', error);
            alert('An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this contact?')) return;

        try {
            const success = await deleteContact(id);
            if (success) {
                await loadContacts();
            } else {
                alert('Failed to delete contact');
            }
        } catch (error) {
            console.error('Error deleting contact:', error);
            alert('Failed to delete contact');
        }
    }

    function openEditModal(contact: Contact) {
        setEditingContact(contact);
        setShowAddModal(true); // Open modal for editing
    }

    async function handleStatusChange(id: string, newStatus: ContactStatus) {
        try {
            // Optimistic update
            setContacts(contacts.map(c => c.id === id ? { ...c, status: newStatus } : c));

            const success = await updateContact(id, { status: newStatus });

            if (!success) {
                console.warn('Failed to update status');
                // We don't revert here to avoid jumping UI, but we warn
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
            await loadContacts(); // Revert on error
        }
    }

    const filteredContacts = contacts.filter(contact => {
        const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (contact.notes && contact.notes.toLowerCase().includes(searchQuery.toLowerCase()));

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
                                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredContacts.map((contact) => (
                                <tr key={contact.id} className="border-b border-border hover:bg-muted/20 transition-colors group">
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
                                        <select
                                            value={contact.status}
                                            onChange={(e) => handleStatusChange(contact.id, e.target.value as ContactStatus)}
                                            className={`text-xs font-medium border rounded-full px-2 py-1 appearance-none cursor-pointer ${statusColors[contact.status]}`}
                                            style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
                                        >
                                            {Object.entries(statusLabels).map(([value, label]) => (
                                                <option key={value} value={value} className="bg-background text-foreground">
                                                    {label}
                                                </option>
                                            ))}
                                        </select>
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
                                    <td className="py-4 px-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => openEditModal(contact)}
                                                className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(contact.id)}
                                                className="p-2 hover:bg-red-500/10 rounded-lg text-muted-foreground hover:text-red-500 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {filteredContacts.length === 0 && !isLoading && !error && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No contacts found matching your criteria.</p>
                </div>
            )}

            {error === 'read_error' && (
                <div className="text-center py-12 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <h3 className="text-lg font-medium text-red-500 mb-2">Storage Error</h3>
                    <p className="text-muted-foreground">Failed to read contacts from local storage.</p>
                </div>
            )}

            {isLoading && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">Loading contacts...</p>
                </div>
            )}

            {/* Add/Edit Contact Modal */}
            {(showAddModal || editingContact) && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-background border border-border rounded-xl p-6 w-full max-w-md shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold">{editingContact ? 'Edit Contact' : 'Add New Contact'}</h2>
                            <button
                                onClick={() => { setShowAddModal(false); setEditingContact(null); }}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form action={handleAddContact} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input
                                    name="name"
                                    defaultValue={editingContact?.name}
                                    required
                                    className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Company</label>
                                <input
                                    name="company"
                                    defaultValue={editingContact?.company}
                                    className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2"
                                    placeholder="Acme Inc"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input
                                    name="email"
                                    type="email"
                                    defaultValue={editingContact?.email}
                                    className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2"
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Phone</label>
                                <input
                                    name="phone"
                                    type="tel"
                                    defaultValue={editingContact?.phone}
                                    className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2"
                                    placeholder="(555) 123-4567"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Notes</label>
                                <textarea
                                    name="notes"
                                    defaultValue={editingContact?.notes}
                                    className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 min-h-[80px]"
                                    placeholder="Add notes about this contact..."
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => { setShowAddModal(false); setEditingContact(null); }}
                                    className="px-4 py-2 text-sm font-medium hover:bg-secondary/80 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Saving...' : (editingContact ? 'Save Changes' : 'Add Contact')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
