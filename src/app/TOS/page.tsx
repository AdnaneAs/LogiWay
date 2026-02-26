"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function TermsOfServicePage() {
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
                        Terms of Service<span className="text-yellow-400">.</span>
                    </h1>
                    <p className="text-sm text-black/40 mt-2">Effective: February 25, 2026</p>

                    <div className="mt-10 space-y-8 text-black/60 leading-relaxed text-[15px]">
                        <section>
                            <h2 className="text-xl font-bold text-black mb-3">1. Acceptance of Terms</h2>
                            <p>
                                By accessing or using the Shipswipe Logistics platform (&quot;Service&quot;), you agree to be bound by
                                these Terms of Service (&quot;Terms&quot;). If you are using the Service on behalf of an organization,
                                you are agreeing to these Terms on behalf of that organization and represent that you have the
                                authority to do so. If you do not agree, you may not use the Service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-black mb-3">2. Service Description</h2>
                            <p>
                                Shipswipe Logistics provides a B2B logistics management platform including shipment tracking,
                                fleet management, analytics, and delivery coordination services. Access is provided exclusively
                                through pre-provisioned accounts — self-registration is not available.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-black mb-3">3. Account Responsibilities</h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Accounts are provisioned by Shipswipe Logistics administrators upon signing a service agreement.</li>
                                <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
                                <li>You must immediately notify us of any unauthorized use of your account.</li>
                                <li>You may not share account credentials with individuals outside your authorized organization.</li>
                                <li>We reserve the right to suspend or terminate accounts that violate these Terms.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-black mb-3">4. Shipment & Service Terms</h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>All shipments are subject to our standard Carrier Terms, provided at the time of account setup.</li>
                                <li>Estimated delivery dates are approximations and not guarantees unless covered by an SLA.</li>
                                <li>Prohibited items include hazardous materials, illegal substances, live animals, and items restricted by applicable law.</li>
                                <li>Shipswipe Logistics reserves the right to inspect shipment contents for compliance and safety purposes.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-black mb-3">5. Pricing & Payment</h2>
                            <p>
                                Pricing is determined by your selected service plan and any applicable volume-based agreements.
                                All fees are billed monthly in advance unless otherwise stated in your service agreement.
                            </p>
                            <ul className="list-disc pl-6 mt-3 space-y-2">
                                <li>Overdue invoices may accrue interest at a rate of 1.5% per month.</li>
                                <li>We reserve the right to adjust pricing with 30 days&apos; written notice.</li>
                                <li>Volume discounts are calculated and applied at the end of each billing cycle.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-black mb-3">6. Liability Limitations</h2>
                            <p>
                                To the maximum extent permitted by law:
                            </p>
                            <ul className="list-disc pl-6 mt-3 space-y-2">
                                <li>Our liability for lost, damaged, or delayed shipments is limited to the declared value at the time of shipping, up to a maximum of $100 USD per package unless additional insurance is purchased.</li>
                                <li>We are not liable for indirect, incidental, special, or consequential damages arising from use of our Service.</li>
                                <li>Force majeure events (natural disasters, government actions, pandemics, etc.) absolve us from delivery guarantees.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-black mb-3">7. Intellectual Property</h2>
                            <p>
                                All content, trademarks, logos, and software associated with the Shipswipe Logistics platform
                                are our exclusive property. You may not reproduce, distribute, or create derivative works
                                without our written permission.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-black mb-3">8. Data & Privacy</h2>
                            <p>
                                Your use of the Service is also governed by our{" "}
                                <Link href="/privacy-policy" className="text-yellow-600 hover:text-yellow-700 underline underline-offset-2">
                                    Privacy Policy
                                </Link>
                                , which describes how we collect, use, and protect your data.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-black mb-3">9. Termination</h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Either party may terminate the service agreement with 30 days&apos; written notice.</li>
                                <li>We may immediately terminate for material breach of these Terms.</li>
                                <li>Upon termination, your data will be retained for 90 days and then permanently deleted unless legal retention requirements apply.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-black mb-3">10. Governing Law</h2>
                            <p>
                                These Terms are governed by and construed in accordance with the laws of the Province of
                                Quebec, Canada, without regard to conflict of law principles. Any disputes arising from these
                                Terms shall be resolved exclusively in the courts of Montreal, Quebec.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-black mb-3">11. Modifications</h2>
                            <p>
                                We reserve the right to modify these Terms at any time. Material changes will be communicated
                                to registered users via email at least 30 days prior to taking effect. Continued use of the
                                Service after modifications constitutes acceptance of the updated Terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-black mb-3">12. Contact</h2>
                            <p>For questions regarding these Terms, please contact:</p>
                            <div className="mt-3 card p-5">
                                <p className="font-semibold text-black">Shipswipe Logistics — Legal Department</p>
                                <p className="text-sm mt-1">Email: legal@shipswipe.com</p>
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
