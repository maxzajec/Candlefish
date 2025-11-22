'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSuite } from '@/lib/suite-storage';
import { Building2, User, Briefcase, FileText, ArrowLeft, Lock } from 'lucide-react';
import Link from 'next/link';

export default function NewSuitePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        owner: '',
        vertical: '',
        description: '',
        credentials: {
            username: '',
            password: '',
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const success = await createSuite(formData);
            if (success) {
                router.push('/admin/dashboard');
                router.refresh();
            } else {
                alert('Failed to create suite');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-2xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/admin/dashboard" className="p-2 hover:bg-secondary rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Create New Suite</h1>
                        <p className="text-muted-foreground mt-1">Set up a new GTM suite for a customer</p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-secondary/50 backdrop-blur-sm border border-border rounded-xl p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-primary" />
                            Suite Name
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder="e.g., TechStart GTM"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground flex items-center gap-2">
                            <User className="w-4 h-4 text-primary" />
                            Owner Name
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.owner}
                            onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder="e.g., Alice Tech"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                <Lock className="w-4 h-4 text-primary" />
                                Owner Username
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.credentials.username}
                                onChange={(e) => setFormData({ ...formData, credentials: { ...formData.credentials, username: e.target.value } })}
                                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                placeholder="username"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                <Lock className="w-4 h-4 text-primary" />
                                Owner Password
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.credentials.password}
                                onChange={(e) => setFormData({ ...formData, credentials: { ...formData.credentials, password: e.target.value } })}
                                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                placeholder="password"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-primary" />
                            Vertical / Industry
                        </label>
                        <select
                            required
                            value={formData.vertical}
                            onChange={(e) => setFormData({ ...formData, vertical: e.target.value })}
                            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        >
                            <option value="">Select a vertical...</option>
                            <option value="SaaS">SaaS</option>
                            <option value="FinTech">FinTech</option>
                            <option value="HealthTech">HealthTech</option>
                            <option value="CleanTech">CleanTech</option>
                            <option value="E-commerce">E-commerce</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary" />
                            Description
                        </label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[100px]"
                            placeholder="Brief description of the project..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating...' : 'Create Suite'}
                    </button>
                </form>
            </div>
        </div>
    );
}
