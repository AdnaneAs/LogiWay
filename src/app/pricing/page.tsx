"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const tiers = [
    {
        name: "Starter",
        price: "$299",
        period: "/month",
        description: "For small businesses with basic shipping needs.",
        features: [
            "Up to 100 shipments/month",
            "Real-time tracking",
            "Email notifications",
            "Basic reporting",
            "Standard support",
        ],
        cta: "Get Started",
        highlighted: false,
    },
    {
        name: "Professional",
        price: "$799",
        period: "/month",
        description: "For growing companies with high-volume logistics.",
        features: [
            "Up to 1,000 shipments/month",
            "Priority tracking & GPS",
            "SMS + Email notifications",
            "Advanced analytics",
            "Fleet management",
            "Priority support (24h)",
            "API access",
        ],
        cta: "Get Started",
        highlighted: true,
    },
    {
        name: "Enterprise",
        price: "Custom",
        period: "",
        description: "Tailored solutions for large-scale operations.",
        features: [
            "Unlimited shipments",
            "Dedicated infrastructure",
            "White-label solution",
            "Custom integrations",
            "Dedicated account manager",
            "24/7 premium support",
            "SLA guarantee",
            "On-site training",
        ],
        cta: "Contact Sales",
        highlighted: false,
    },
];

export default function PricingPage() {
    return (
        <div className="min-h-screen py-20 px-6">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400/10 rounded-full mb-6">
                        <span className="text-sm font-medium text-black/60">
                            Transparent Pricing
                        </span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-bold text-black">
                        Plans that scale with you<span className="text-yellow-400">.</span>
                    </h1>
                    <p className="text-black/40 mt-4 max-w-xl mx-auto">
                        Choose the plan that fits your logistics volume. Upgrade or
                        downgrade anytime.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {tiers.map((tier, i) => (
                        <motion.div
                            key={tier.name}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.15, duration: 0.5 }}
                            className={`relative rounded-2xl p-8 ${tier.highlighted
                                    ? "bg-black text-white ring-2 ring-yellow-400 shadow-2xl shadow-yellow-400/10"
                                    : "card"
                                }`}
                        >
                            {tier.highlighted && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-yellow-400 text-black text-xs font-bold rounded-full">
                                    Most Popular
                                </div>
                            )}

                            <h3
                                className={`text-lg font-bold ${tier.highlighted ? "text-white" : "text-black"
                                    }`}
                            >
                                {tier.name}
                            </h3>
                            <p
                                className={`text-sm mt-1 ${tier.highlighted ? "text-white/50" : "text-black/40"
                                    }`}
                            >
                                {tier.description}
                            </p>

                            <div className="mt-6 mb-8">
                                <span
                                    className={`text-4xl font-bold ${tier.highlighted ? "text-white" : "text-black"
                                        }`}
                                >
                                    {tier.price}
                                </span>
                                <span
                                    className={`text-sm ${tier.highlighted ? "text-white/40" : "text-black/30"
                                        }`}
                                >
                                    {tier.period}
                                </span>
                            </div>

                            <ul className="space-y-3 mb-8">
                                {tier.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-3">
                                        <svg
                                            className={`w-5 h-5 mt-0.5 flex-shrink-0 ${tier.highlighted ? "text-yellow-400" : "text-yellow-500"
                                                }`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        <span
                                            className={`text-sm ${tier.highlighted ? "text-white/70" : "text-black/50"
                                                }`}
                                        >
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                className={`w-full py-3 rounded-full font-semibold transition-all duration-300 ${tier.highlighted
                                        ? "bg-yellow-400 text-black hover:bg-yellow-300"
                                        : "bg-black/5 text-black hover:bg-black/10"
                                    }`}
                            >
                                {tier.cta}
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
