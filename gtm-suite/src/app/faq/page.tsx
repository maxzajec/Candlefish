'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
    {
        category: 'Product & Pricing',
        questions: [
            {
                q: 'What is your pricing model?',
                a: 'We offer flexible pricing based on volume and partnership tier. Our standard model includes a base fee plus performance incentives, ensuring alignment with your success.',
            },
            {
                q: 'What makes your product different from competitors?',
                a: 'Our solution combines cutting-edge technology with personalized service. We offer faster implementation, better support, and more flexible customization than traditional providers.',
            },
            {
                q: 'Do you offer volume discounts?',
                a: 'Yes, we provide tiered pricing that rewards growth. As your volume increases, your per-unit costs decrease, making our partnership more valuable over time.',
            },
        ],
    },
    {
        category: 'Partnership & Support',
        questions: [
            {
                q: 'What kind of support do you provide?',
                a: 'We offer 24/7 technical support, a dedicated account manager, quarterly business reviews, and access to our training resources and marketing materials.',
            },
            {
                q: 'How long does implementation take?',
                a: 'Typical implementation takes 2-4 weeks depending on complexity. We provide a dedicated onboarding specialist to ensure smooth integration.',
            },
            {
                q: 'What are the contract terms?',
                a: 'We offer flexible terms starting from 12 months. Our agreements include clear performance metrics and mutual success criteria.',
            },
        ],
    },
    {
        category: 'Technical & Integration',
        questions: [
            {
                q: 'Does it integrate with existing systems?',
                a: 'Yes, we offer pre-built integrations with major platforms and APIs for custom connections. Our technical team assists with all integration needs.',
            },
            {
                q: 'What are the technical requirements?',
                a: 'Minimal requirements - cloud-based solution accessible via web browser. We handle all infrastructure and maintenance.',
            },
            {
                q: 'How do you handle data security?',
                a: 'We maintain SOC 2 Type II compliance, use enterprise-grade encryption, and follow industry best practices for data protection and privacy.',
            },
        ],
    },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-border rounded-lg overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/20 transition-colors"
            >
                <span className="font-medium text-foreground">{question}</span>
                {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                )}
            </button>
            {isOpen && (
                <div className="px-4 pb-4 text-sm text-muted-foreground border-t border-border pt-4 bg-muted/10">
                    {answer}
                </div>
            )}
        </div>
    );
}

export default function FAQPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Frequently Asked Questions</h1>
                <p className="text-muted-foreground mt-1">Common questions and answers to help you sell effectively</p>
            </div>

            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">💬 Sales Tip</h3>
                <p className="text-muted-foreground">
                    Familiarize yourself with these FAQs before customer calls. Being prepared with clear, confident answers
                    builds trust and accelerates the sales cycle.
                </p>
            </div>

            {faqs.map((category) => (
                <div key={category.category} className="space-y-4">
                    <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                        <span className="w-1 h-6 bg-primary rounded-full"></span>
                        {category.category}
                    </h2>
                    <div className="space-y-3">
                        {category.questions.map((item, index) => (
                            <FAQItem key={index} question={item.q} answer={item.a} />
                        ))}
                    </div>
                </div>
            ))}

            <div className="bg-secondary/50 backdrop-blur-sm border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">Can't find your answer?</h3>
                <p className="text-muted-foreground mb-4">
                    If you encounter a question not covered here, reach out to our support team. We'll help you craft
                    the perfect response and potentially add it to this list.
                </p>
                <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-4 rounded-lg transition-colors">
                    Contact Support
                </button>
            </div>
        </div>
    );
}
