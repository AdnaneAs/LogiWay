import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t border-black/5 py-12">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    {/* Logo */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                                <span className="text-black font-bold text-sm">L</span>
                            </div>
                            <span className="font-semibold text-black">Shipswipe Logistics</span>
                        </div>
                        <p className="text-xs text-black/30 leading-relaxed">
                            Enterprise-grade logistics infrastructure for B2B companies across USA and Canada.
                        </p>
                    </div>
                    {/* Services */}
                    <div>
                        <p className="text-xs font-semibold text-black/50 uppercase tracking-wider mb-3">Services</p>
                        <ul className="space-y-2">
                            <li><Link href="/login" className="text-sm text-black/40 hover:text-black transition-colors">International Freight</Link></li>
                            <li><Link href="/login" className="text-sm text-black/40 hover:text-black transition-colors">Domestic Delivery</Link></li>
                            <li><Link href="/login" className="text-sm text-black/40 hover:text-black transition-colors">Last Mile</Link></li>
                        </ul>
                    </div>
                    {/* Resources */}
                    <div>
                        <p className="text-xs font-semibold text-black/50 uppercase tracking-wider mb-3">Resources</p>
                        <ul className="space-y-2">
                            <li><Link href="/about#about" className="text-sm text-black/40 hover:text-black transition-colors">About Us</Link></li>
                            <li><Link href="/about#case-studies" className="text-sm text-black/40 hover:text-black transition-colors">Case Studies</Link></li>
                            <li><Link href="/about#documentation" className="text-sm text-black/40 hover:text-black transition-colors">Documentation</Link></li>
                            <li><Link href="/pricing" className="text-sm text-black/40 hover:text-black transition-colors">Pricing</Link></li>
                            <li><Link href="/#contact" className="text-sm text-black/40 hover:text-black transition-colors">Contact</Link></li>
                        </ul>
                    </div>
                    {/* Legal */}
                    <div>
                        <p className="text-xs font-semibold text-black/50 uppercase tracking-wider mb-3">Legal</p>
                        <ul className="space-y-2">
                            <li><Link href="/privacy-policy" className="text-sm text-black/40 hover:text-black transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/TOS" className="text-sm text-black/40 hover:text-black transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-black/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-black/30">
                        © 2026 Shipswipe Logistics. All rights reserved.
                    </p>
                    <p className="text-xs text-black/20">
                        Built for enterprise logistics.
                    </p>
                </div>
            </div>
        </footer>
    );
}
