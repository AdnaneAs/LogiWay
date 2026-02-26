"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen py-20 px-6">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link href="/" className="text-sm text-black/40 hover:text-black/60 transition-colors">
                        ← Back to Home
                    </Link>

                    <h1 className="text-4xl font-bold text-black mt-6">
                        Privacy Policy<span className="text-yellow-400">.</span>
                    </h1>
                    <p className="text-sm text-black/40 mt-2">Last updated: February 25, 2026</p>

                    <div className="mt-10 space-y-8 text-black/60 leading-relaxed text-[15px]">
                        <section>
                            <h2 className="text-xl font-bold text-black mb-3">1. Information We Collect</h2>
                            <p>
                                Shipswipe Logistics (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) collects information you provide directly
                                when using our services. This includes:
                            </p>
                            <ul className="list-disc pl-6 mt-3 space-y-2">
                                <li><strong className="text-black">Account Information:</strong> Name, email address, company name, and job title provided during account setup.</li>
                                <li><strong className="text-black">Shipment Data:</strong> Origin, destination, weight, dimensions, and contents of shipments processed through our platform.</li>
                                <li><strong className="text-black">Communication Data:</strong> Messages and inquiries sent through our contact form or support channels.</li>
                                <li><strong className="text-black">Usage Data:</strong> Log files, IP addresses, browser type, and interaction patterns with our platform.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-black mb-3">2. How We Use Your Information</h2>
                            <p>We use collected information to:</p>
                            <ul className="list-disc pl-6 mt-3 space-y-2">
                                <li>Process and manage shipments on behalf of your organization.</li>
                                <li>Provide real-time tracking updates and delivery notifications.</li>
                                <li>Generate analytics and reports for your logistics operations.</li>
                                <li>Communicate service updates, billing information, and support responses.</li>
                                <li>Improve our platform, algorithms, and user experience.</li>
                                <li>Comply with legal obligations and enforce our terms.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-black mb-3">3. Data Sharing & Disclosure</h2>
                            <p>
                                We do not sell your personal information. We may share data with:
                            </p>
                            <ul className="list-disc pl-6 mt-3 space-y-2">
                                <li><strong className="text-black">Service Partners:</strong> Carriers and logistics partners required to fulfill shipments.</li>
                                <li><strong className="text-black">Infrastructure Providers:</strong> Cloud hosting and database services that store data on our behalf.</li>
                                <li><strong className="text-black">Legal Authorities:</strong> When required by law, subpoena, or to protect our rights.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-black mb-3">4. Data Security</h2>
                            <p>
                                We implement industry-standard security measures including encryption at rest and in transit,
                                role-based access controls, regular security audits, and compliance with SOC 2 standards.
                                Despite these measures, no method of transmission over the Internet is 100% secure.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-black mb-3">5. Data Retention</h2>
                            <p>
                                We retain your data for the duration of your business relationship with us, plus an additional
                                period as required by applicable laws (typically 7 years for financial records). Shipment tracking
                                data is retained for 3 years after delivery completion.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-black mb-3">6. Your Rights</h2>
                            <p>Depending on your jurisdiction, you may have the right to:</p>
                            <ul className="list-disc pl-6 mt-3 space-y-2">
                                <li>Access, correct, or delete your personal information.</li>
                                <li>Object to or restrict certain processing activities.</li>
                                <li>Request a portable copy of your data.</li>
                                <li>Withdraw consent where processing is based on consent.</li>
                            </ul>
                            <p className="mt-3">
                                To exercise any of these rights, contact us at <strong className="text-black">privacy@shipswipe.com</strong>.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-black mb-3">7. Cookies & Tracking</h2>
                            <p>
                                Our platform uses essential cookies for authentication and session management. We do not use
                                advertising cookies or third-party trackers. Analytics cookies may be used to improve
                                platform performance and are anonymized.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-black mb-3">8. Changes to This Policy</h2>
                            <p>
                                We may update this Privacy Policy from time to time. We will notify registered users of
                                material changes via email at least 30 days before they take effect.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-black mb-3">9. Contact Us</h2>
                            <p>
                                If you have questions about this Privacy Policy, please contact us:
                            </p>
                            <div className="mt-3 card p-5">
                                <p className="font-semibold text-black">Shipswipe Logistics — Privacy Team</p>
                                <p className="text-sm mt-1">Email: privacy@shipswipe.com</p>
                                <p className="text-sm">Phone: 1-800-SHIPSWIPE</p>
                                <p className="text-sm">Address: 1200 Avenue des Canadiens, Montreal, QC, H3B 0G7</p>
                            </div>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
