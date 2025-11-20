'use client';

import { useState } from 'react';
import { MessageSquare, Send, Clock, CheckCircle } from 'lucide-react';

const supportTickets = [
    {
        id: 'TKT-001',
        subject: 'Question about pricing tier',
        status: 'resolved',
        date: '2025-11-15',
    },
    {
        id: 'TKT-002',
        subject: 'Need custom marketing materials',
        status: 'in-progress',
        date: '2025-11-18',
    },
];

export default function SupportPage() {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        alert('Support request submitted! We\'ll get back to you within 24 hours.');
        setSubject('');
        setMessage('');
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Support</h1>
                <p className="text-muted-foreground mt-1">Get help from our team</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Contact Info */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-secondary/50 backdrop-blur-sm border border-border rounded-xl p-6">
                        <h3 className="font-semibold text-foreground mb-4">Contact Information</h3>
                        <div className="space-y-3 text-sm">
                            <div>
                                <p className="text-muted-foreground mb-1">Email</p>
                                <p className="text-foreground font-medium">support@candlefish.com</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground mb-1">Phone</p>
                                <p className="text-foreground font-medium">(555) 100-2000</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground mb-1">Hours</p>
                                <p className="text-foreground font-medium">Mon-Fri, 9AM-6PM EST</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-secondary/50 backdrop-blur-sm border border-border rounded-xl p-6">
                        <h3 className="font-semibold text-foreground mb-4">Response Time</h3>
                        <div className="flex items-center gap-3 text-sm">
                            <Clock className="w-5 h-5 text-accent" />
                            <div>
                                <p className="text-foreground font-medium">Average: 4 hours</p>
                                <p className="text-muted-foreground">During business hours</p>
                            </div>
                        </div>
                    </div>

                    {/* Recent Tickets */}
                    <div className="bg-secondary/50 backdrop-blur-sm border border-border rounded-xl p-6">
                        <h3 className="font-semibold text-foreground mb-4">Your Recent Tickets</h3>
                        <div className="space-y-3">
                            {supportTickets.map((ticket) => (
                                <div key={ticket.id} className="border border-border rounded-lg p-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-mono text-muted-foreground">{ticket.id}</span>
                                        {ticket.status === 'resolved' ? (
                                            <CheckCircle className="w-4 h-4 text-green-400" />
                                        ) : (
                                            <Clock className="w-4 h-4 text-yellow-400" />
                                        )}
                                    </div>
                                    <p className="text-sm text-foreground font-medium mb-1">{ticket.subject}</p>
                                    <p className="text-xs text-muted-foreground">{ticket.date}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Support Form */}
                <div className="lg:col-span-2">
                    <div className="bg-secondary/50 backdrop-blur-sm border border-border rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-lg bg-primary/20">
                                <MessageSquare className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-foreground">Submit a Support Request</h2>
                                <p className="text-sm text-muted-foreground">We typically respond within 4 hours</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                                    Subject
                                </label>
                                <input
                                    id="subject"
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="Brief description of your issue or question"
                                    required
                                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
                                />
                            </div>

                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-foreground mb-2">
                                    Category
                                </label>
                                <select
                                    id="category"
                                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                                >
                                    <option>General Question</option>
                                    <option>Technical Support</option>
                                    <option>Sales Assistance</option>
                                    <option>Marketing Materials</option>
                                    <option>Account Management</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="priority" className="block text-sm font-medium text-foreground mb-2">
                                    Priority
                                </label>
                                <select
                                    id="priority"
                                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                                >
                                    <option>Low</option>
                                    <option>Medium</option>
                                    <option>High</option>
                                    <option>Urgent</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Provide details about your request..."
                                    required
                                    rows={6}
                                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <Send className="w-4 h-4" />
                                Submit Request
                            </button>
                        </form>
                    </div>

                    <div className="mt-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-foreground mb-2">💡 Quick Tip</h3>
                        <p className="text-muted-foreground">
                            Before submitting a request, check the FAQ section - many common questions are already answered there!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
