"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";

/* ─────────── HERO SLIDER ─────────── */
const heroSlides = [
    { src: "/hero-1.png", alt: "Modern logistics truck on highway at night" },
    { src: "/hero-2.png", alt: "High-tech warehouse interior" },
    { src: "/hero-3.png", alt: "Logistics fleet at distribution center" },
];

const heroTaglines = [
    { pre: "", highlight: "B2B", post: " Delivery Excellence" },
    { pre: "Powering Your ", highlight: "Supply Chain", post: "" },
    { pre: "From Warehouse to ", highlight: "Doorstep", post: "" },
];

function HeroCarousel({ onSlideChange }: { onSlideChange?: (i: number) => void }) {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => {
                const next = (prev + 1) % heroSlides.length;
                onSlideChange?.(next);
                return next;
            });
        }, 5000);
        return () => clearInterval(interval);
    }, [onSlideChange]);

    const goTo = (i: number) => {
        setCurrent(i);
        onSlideChange?.(i);
    };

    return (
        <div className="absolute inset-0 z-0">
            {heroSlides.map((slide, i) => (
                <div
                    key={slide.src}
                    className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                    style={{ opacity: current === i ? 1 : 0 }}
                >
                    <Image
                        src={slide.src}
                        alt={slide.alt}
                        fill
                        className="object-cover"
                        priority={i === 0}
                        sizes="100vw"
                    />
                </div>
            ))}
            {/* Dark overlay for text contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />
            {/* Slide indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {heroSlides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${current === i ? "w-8 bg-yellow-400" : "w-4 bg-white/30 hover:bg-white/50"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}

/* ─────────── ANIMATED TRUCK SVG ─────────── */
function AnimatedTruck() {
    return (
        <svg viewBox="0 0 240 100" className="w-[220px] h-[90px]">
            <rect x="60" y="30" width="120" height="50" rx="4" fill="#FACC15" />
            <rect x="60" y="30" width="120" height="12" rx="4" fill="#EAB308" />
            <path d="M180 40 L210 40 L220 60 L180 60 Z" fill="#000" />
            <rect x="190" y="44" width="20" height="12" rx="2" fill="#87CEEB" opacity="0.7" />
            <text x="100" y="62" fill="#000" fontSize="14" fontWeight="bold" fontFamily="Inter">L</text>
            <circle cx="110" cy="58" r="3" fill="#000" />
            <circle cx="90" cy="82" r="10" fill="#333" />
            <circle cx="90" cy="82" r="5" fill="#666" />
            <circle cx="200" cy="82" r="10" fill="#333" />
            <circle cx="200" cy="82" r="5" fill="#666" />
            {/* Wheel spin */}
            <circle cx="90" cy="82" r="7" fill="none" stroke="#888" strokeWidth="1" strokeDasharray="3 3">
                <animateTransform attributeName="transform" type="rotate" values="0 90 82;360 90 82" dur="0.8s" repeatCount="indefinite" />
            </circle>
            <circle cx="200" cy="82" r="7" fill="none" stroke="#888" strokeWidth="1" strokeDasharray="3 3">
                <animateTransform attributeName="transform" type="rotate" values="0 200 82;360 200 82" dur="0.8s" repeatCount="indefinite" />
            </circle>
            {/* Exhaust */}
            <circle cx="50" cy="70" r="4" fill="#00000010">
                <animate attributeName="cx" values="50;30;10" dur="1s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;0.1;0" dur="1s" repeatCount="indefinite" />
                <animate attributeName="r" values="4;6;8" dur="1s" repeatCount="indefinite" />
            </circle>
        </svg>
    );
}

/* ─────────── CARGO VAN TRANSITION ─────────── */
function CargoVanSvg() {
    return (
        <svg viewBox="0 0 220 100" className="w-[200px] h-[80px]" style={{ transform: "scaleX(-1)" }}>
            {/* Van body */}
            <rect x="40" y="25" width="130" height="55" rx="6" fill="#000" />
            <rect x="40" y="25" width="130" height="14" rx="6" fill="#1a1a1a" />
            {/* Cargo area */}
            <rect x="45" y="40" width="80" height="35" rx="3" fill="#222" />
            {/* Yellow accent stripe */}
            <rect x="40" y="72" width="130" height="4" rx="2" fill="#FACC15" />
            {/* Cab windshield */}
            <path d="M130 30 L165 30 L172 50 L130 50 Z" fill="#333" />
            <rect x="135" y="33" width="28" height="14" rx="2" fill="#87CEEB" opacity="0.5" />
            {/* Logo on van */}
            <circle cx="85" cy="55" r="8" fill="#FACC15" />
            <text x="85" y="59" fill="#000" fontSize="10" fontWeight="bold" fontFamily="Inter" textAnchor="middle">L</text>
            {/* Wheels */}
            <circle cx="70" cy="82" r="10" fill="#333" />
            <circle cx="70" cy="82" r="5" fill="#555" />
            <circle cx="155" cy="82" r="10" fill="#333" />
            <circle cx="155" cy="82" r="5" fill="#555" />
            {/* Wheel spin */}
            <circle cx="70" cy="82" r="7" fill="none" stroke="#777" strokeWidth="1" strokeDasharray="3 3">
                <animateTransform attributeName="transform" type="rotate" values="0 70 82;360 70 82" dur="0.6s" repeatCount="indefinite" />
            </circle>
            <circle cx="155" cy="82" r="7" fill="none" stroke="#777" strokeWidth="1" strokeDasharray="3 3">
                <animateTransform attributeName="transform" type="rotate" values="0 155 82;360 155 82" dur="0.6s" repeatCount="indefinite" />
            </circle>
            {/* Exhaust puffs */}
            <circle cx="180" cy="70" r="3" fill="#00000015">
                <animate attributeName="cx" values="180;200;220" dur="0.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.25;0.1;0" dur="0.8s" repeatCount="indefinite" />
                <animate attributeName="r" values="3;5;7" dur="0.8s" repeatCount="indefinite" />
            </circle>
            <circle cx="185" cy="65" r="2" fill="#00000010">
                <animate attributeName="cx" values="185;205;225" dur="1s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.15;0.05;0" dur="1s" repeatCount="indefinite" />
                <animate attributeName="r" values="2;4;6" dur="1s" repeatCount="indefinite" />
            </circle>
        </svg>
    );
}

function VanTransition() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });
    // Drives right-to-left (opposite of the first truck)
    const vanX = useTransform(scrollYProgress, [0, 1], ["110%", "-20%"]);

    return (
        <section ref={sectionRef} className="relative py-8 overflow-hidden">
            {/* Road line */}
            <div className="absolute left-0 right-0 bottom-[28px] h-[3px] bg-gradient-to-r from-transparent via-black/10 to-transparent" />
            <div className="absolute left-0 right-0 bottom-[26px] h-[1px] bg-black/5" />
            {/* Dashed center line */}
            <div
                className="absolute left-0 right-0 bottom-[35px] h-[2px]"
                style={{
                    backgroundImage: "repeating-linear-gradient(90deg, #000 0px, #000 20px, transparent 20px, transparent 40px)",
                    opacity: 0.08,
                }}
            />
            {/* The van */}
            <motion.div style={{ x: vanX }} className="relative z-10">
                <CargoVanSvg />
            </motion.div>
        </section>
    );
}

/* ─────────── FLEET DATA ─────────── */
const fleetVehicles = [
    { type: "18-Wheeler", count: "45+", desc: "Long-haul cross-country freight" },
    { type: "Refrigerated Trucks", count: "20+", desc: "Temperature-controlled cargo" },
    { type: "Box Trucks", count: "60+", desc: "Regional & urban deliveries" },
    { type: "Cargo Vans", count: "30+", desc: "Last-mile & express delivery" },
];

/* ─────────── PRICING DATA ─────────── */
const tiers = [
    {
        name: "Starter",
        price: "$299",
        period: "/month",
        description: "For small businesses getting started.",
        features: ["Up to 100 shipments/month", "Real-time tracking", "Email notifications", "Basic reporting", "Standard support"],
        highlighted: false,
    },
    {
        name: "Business",
        price: "$799",
        period: "/month",
        description: "For growing companies with high volume.",
        features: ["Up to 1,000 shipments/month", "Priority tracking & GPS", "SMS + Email notifications", "Advanced analytics", "Fleet management", "Priority support (24h)", "API access"],
        highlighted: true,
    },
    {
        name: "Enterprise",
        price: "Custom",
        period: "",
        description: "Tailored solutions for large-scale ops.",
        features: ["Unlimited shipments", "Dedicated infrastructure", "White-label solution", "Custom integrations", "Dedicated account manager", "24/7 premium support", "SLA guarantee"],
        highlighted: false,
    },
];

/* ─────────── NETWORK CANVAS BACKGROUND ─────────── */
function NetworkCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animId: number;
        const DOT_COUNT = 50;
        const CONNECT_DIST = 120;
        const DOT_RADIUS = 2.5;

        interface Dot {
            x: number; y: number; vx: number; vy: number;
        }

        const resize = () => {
            canvas.width = canvas.offsetWidth * window.devicePixelRatio;
            canvas.height = canvas.offsetHeight * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };

        resize();
        window.addEventListener("resize", resize);

        const dots: Dot[] = Array.from({ length: DOT_COUNT }, () => ({
            x: Math.random() * canvas.offsetWidth,
            y: Math.random() * canvas.offsetHeight,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
        }));

        const draw = () => {
            const w = canvas.offsetWidth;
            const h = canvas.offsetHeight;
            ctx.clearRect(0, 0, w, h);

            // Move dots
            dots.forEach((d) => {
                d.x += d.vx;
                d.y += d.vy;
                if (d.x < 0 || d.x > w) d.vx *= -1;
                if (d.y < 0 || d.y > h) d.vy *= -1;
                d.x = Math.max(0, Math.min(w, d.x));
                d.y = Math.max(0, Math.min(h, d.y));
            });

            // Draw connections
            for (let i = 0; i < dots.length; i++) {
                for (let j = i + 1; j < dots.length; j++) {
                    const dx = dots[i].x - dots[j].x;
                    const dy = dots[i].y - dots[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < CONNECT_DIST) {
                        const alpha = (1 - dist / CONNECT_DIST) * 0.35;
                        ctx.strokeStyle = `rgba(250, 204, 21, ${alpha})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(dots[i].x, dots[i].y);
                        ctx.lineTo(dots[j].x, dots[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Draw dots
            dots.forEach((d) => {
                ctx.beginPath();
                ctx.arc(d.x, d.y, DOT_RADIUS, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(250, 204, 21, 0.6)";
                ctx.fill();
                // Glow
                ctx.beginPath();
                ctx.arc(d.x, d.y, DOT_RADIUS * 2.5, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(250, 204, 21, 0.08)";
                ctx.fill();
            });

            animId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
        />
    );
}

/* ═══════════════════════════════════ */
/*             MAIN PAGE              */
/* ═══════════════════════════════════ */
export default function HomePage() {
    const router = useRouter();
    const [trackingId, setTrackingId] = useState("");

    // Scroll-truck refs
    const truckSectionRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress: truckScroll } = useScroll({
        target: truckSectionRef,
        offset: ["start end", "end start"],
    });
    const truckX = useTransform(truckScroll, [0, 1], ["-20%", "110%"]);

    // Contact form state
    const [contactForm, setContactForm] = useState({
        company: "", email: "", service: "", message: "",
    });
    const [formSubmitted, setFormSubmitted] = useState(false);

    const handleTrack = (e: React.FormEvent) => {
        e.preventDefault();
        if (trackingId.trim()) {
            router.push(`/track/${encodeURIComponent(trackingId.trim())}`);
        }
    };

    const handleContactSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormSubmitted(true);
        setTimeout(() => setFormSubmitted(false), 4000);
        setContactForm({ company: "", email: "", service: "", message: "" });
    };

    const handleSelectPlan = (planName: string, planPrice: string) => {
        const msg = planPrice === "Custom"
            ? `Hi, I'm interested in the ${planName} plan. I'd like to discuss custom pricing and features tailored to our logistics needs.`
            : `Hi, I'm interested in the ${planName} plan (${planPrice}/month). Please help me get started with setting up our account.`;
        setContactForm((prev) => ({
            ...prev,
            message: msg,
            service: planName === "Enterprise" ? "enterprise" : "",
        }));
        setFormSubmitted(false);
        setTimeout(() => {
            document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    const stats = [
        { value: "10K+", label: "Deliveries / Month" },
        { value: "99.8%", label: "On-Time Rate" },
        { value: "500+", label: "B2B Clients" },
        { value: "24/7", label: "Live Tracking" },
    ];

    const [heroSlide, setHeroSlide] = useState(0);
    const handleSlideChange = useCallback((i: number) => setHeroSlide(i), []);

    return (
        <div>
            {/* ──── HERO SECTION ──── */}
            <section className="relative min-h-[92vh] flex items-center overflow-hidden">
                <HeroCarousel onSlideChange={handleSlideChange} />

                <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="max-w-2xl"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/10">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                            <span className="text-sm font-medium text-white/70">Real-time tracking available</span>
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-black text-white leading-[0.95] tracking-tight">
                            Move faster<span className="text-yellow-400">.</span>
                            <br />
                            Ship smarter<span className="text-yellow-400">.</span>
                        </h1>

                        {/* Animated B2B tagline synced with slider */}
                        <div className="mt-4 h-10 relative overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={heroSlide}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                    className="text-xl lg:text-2xl font-semibold text-white/80 absolute inset-0"
                                >
                                    {heroTaglines[heroSlide].pre}
                                    <span className="text-yellow-400 font-black">{heroTaglines[heroSlide].highlight}</span>
                                    {heroTaglines[heroSlide].post}
                                </motion.p>
                            </AnimatePresence>
                        </div>

                        <p className="text-lg text-white/60 mt-4 max-w-lg leading-relaxed">
                            Enterprise-grade logistics infrastructure for B2B companies.
                            Track every shipment in real-time with unmatched reliability.
                        </p>

                        {/* Tracking Input */}
                        <form onSubmit={handleTrack} className="mt-8" id="track">
                            <div className="flex gap-3">
                                <div className="relative flex-1">
                                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        value={trackingId}
                                        onChange={(e) => setTrackingId(e.target.value)}
                                        placeholder="Enter tracking ID"
                                        className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-200"
                                    />
                                </div>
                                <button type="submit" className="px-8 py-4 bg-yellow-400 text-black font-semibold rounded-xl hover:bg-yellow-300 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/30 active:scale-95 whitespace-nowrap">
                                    Track
                                </button>
                            </div>
                        </form>

                        {/* Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12">
                            {stats.map((stat, i) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                                >
                                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                                    <div className="text-xs text-white/40 mt-1">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ──── SCROLL-TRUCK TRANSITION ──── */}
            <section
                ref={truckSectionRef}
                className="relative py-8 overflow-hidden"
            >
                {/* Road line */}
                <div className="absolute left-0 right-0 bottom-[28px] h-[3px] bg-gradient-to-r from-transparent via-black/10 to-transparent" />
                <div className="absolute left-0 right-0 bottom-[26px] h-[1px] bg-black/5" />
                {/* Dashed center line */}
                <div className="absolute left-0 right-0 bottom-[35px] h-[2px]"
                    style={{
                        backgroundImage: "repeating-linear-gradient(90deg, #FACC15 0px, #FACC15 20px, transparent 20px, transparent 40px)",
                        opacity: 0.3,
                    }}
                />

                {/* The truck */}
                <motion.div
                    style={{ x: truckX }}
                    className="relative z-10"
                >
                    <AnimatedTruck />
                </motion.div>
            </section>

            {/* ──── FEATURES SECTION ──── */}
            <section className="py-24 relative" id="services">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-black">
                            Built for enterprise<span className="text-yellow-400">.</span>
                        </h2>
                        <p className="text-black/40 mt-4 max-w-2xl mx-auto">
                            Everything you need to manage logistics at scale, from tracking to fleet operations.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: (<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>),
                                title: "Real-Time Tracking",
                                desc: "Follow every package from pickup to delivery with live GPS tracking and instant notifications.",
                            },
                            {
                                icon: (<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>),
                                title: "Enterprise Security",
                                desc: "Role-based access control, encrypted data at rest, and audit logging for every operation.",
                            },
                            {
                                icon: (<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>),
                                title: "Lightning Fast",
                                desc: "Sub-second status updates and optimized routing algorithms for maximum efficiency.",
                            },
                        ].map((feature, i) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15, duration: 0.5 }}
                                className="card group cursor-default"
                            >
                                <div className="w-14 h-14 bg-yellow-400/10 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-yellow-400/20 transition-colors duration-300">
                                    <div className="text-yellow-500">{feature.icon}</div>
                                </div>
                                <h3 className="text-lg font-bold text-black mb-2">{feature.title}</h3>
                                <p className="text-sm text-black/40 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ──── FLEET SHOWCASE ──── */}
            <section className="py-24 bg-black/[0.02] relative overflow-hidden" id="fleet-section">
                {/* Floating decorative dots */}
                <motion.div
                    animate={{ y: [-12, 12, -12], x: [-5, 5, -5] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-16 right-24 w-5 h-5 bg-yellow-400 rounded-full opacity-30"
                />
                <motion.div
                    animate={{ y: [8, -16, 8] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-20 left-16 w-3 h-3 bg-black rounded-full opacity-10"
                />
                <motion.div
                    animate={{ y: [-8, 8, -8], x: [4, -4, 4] }}
                    transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/2 right-12 w-4 h-4 bg-yellow-400/40 rounded-full"
                />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400/10 rounded-full mb-6"
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                className="w-2 h-2 bg-yellow-400 rounded-full"
                            />
                            <span className="text-sm font-medium text-black/60">150+ Active Vehicles</span>
                        </motion.div>
                        <h2 className="text-4xl font-bold text-black">
                            Our fleet<span className="text-yellow-400">.</span>
                        </h2>
                        <p className="text-black/40 mt-4 max-w-2xl mx-auto">
                            A diverse fleet of 150+ vehicles ready to move your cargo anywhere.
                        </p>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {fleetVehicles.map((v, i) => (
                            <motion.div
                                key={v.type}
                                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{
                                    delay: i * 0.15,
                                    duration: 0.6,
                                    type: "spring",
                                    stiffness: 120,
                                    damping: 14,
                                }}
                                whileHover={{
                                    y: -8,
                                    scale: 1.03,
                                    boxShadow: "0 20px 40px rgba(250, 204, 21, 0.12)",
                                    transition: { duration: 0.25 },
                                }}
                                className="card text-center group cursor-default"
                            >
                                {/* Animated icon container */}
                                <div className="relative w-20 h-20 mx-auto mb-5">
                                    {/* Pulse ring */}
                                    <motion.div
                                        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0, 0.2] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
                                        className="absolute inset-0 bg-yellow-400/20 rounded-full"
                                    />
                                    {/* Outer ring */}
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 20 + i * 5, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-0 rounded-full border-2 border-dashed border-yellow-400/15"
                                    />
                                    {/* Icon background */}
                                    <div className="absolute inset-2 bg-yellow-400/10 rounded-full flex items-center justify-center group-hover:bg-yellow-400/25 transition-colors duration-300">
                                        {/* Unique icon per vehicle type */}
                                        {i === 0 && (
                                            <svg className="w-8 h-8 text-yellow-500 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                                            </svg>
                                        )}
                                        {i === 1 && (
                                            <svg className="w-8 h-8 text-yellow-500 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                        )}
                                        {i === 2 && (
                                            <svg className="w-8 h-8 text-yellow-500 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                            </svg>
                                        )}
                                        {i === 3 && (
                                            <svg className="w-8 h-8 text-yellow-500 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        )}
                                    </div>
                                </div>

                                {/* Animated counter */}
                                <motion.p
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 + i * 0.15, type: "spring", stiffness: 150 }}
                                    className="text-3xl font-bold text-black"
                                >
                                    {v.count}
                                </motion.p>

                                <motion.p
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4 + i * 0.15, duration: 0.4 }}
                                    className="text-sm font-semibold text-black mt-1"
                                >
                                    {v.type}
                                </motion.p>

                                <motion.p
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.5 + i * 0.15, duration: 0.4 }}
                                    className="text-xs text-black/40 mt-1"
                                >
                                    {v.desc}
                                </motion.p>

                                {/* Bottom accent bar on hover */}
                                <motion.div
                                    className="h-1 bg-yellow-400 rounded-full mt-4 mx-auto"
                                    initial={{ width: 0 }}
                                    whileHover={{ width: "60%" }}
                                    transition={{ duration: 0.3 }}
                                />
                            </motion.div>
                        ))}
                    </div>

                    {/* Fleet total bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        className="mt-12 text-center"
                    >
                        <div className="inline-flex items-center gap-4 px-6 py-3 bg-white rounded-full border border-black/5 shadow-sm">
                            <div className="flex -space-x-2">
                                {[0, 1, 2, 3].map((j) => (
                                    <motion.div
                                        key={j}
                                        initial={{ x: -10, opacity: 0 }}
                                        whileInView={{ x: 0, opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 1 + j * 0.1 }}
                                        className="w-8 h-8 rounded-full bg-yellow-400 border-2 border-white flex items-center justify-center"
                                    >
                                        <span className="text-[10px] font-bold text-black">
                                            {["🚛", "❄️", "📦", "⚡"][j]}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                            <p className="text-sm text-black/60">
                                <strong className="text-black">155+</strong> vehicles across <strong className="text-black">4</strong> categories
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ──── SCROLL-VAN TRANSITION ──── */}
            <VanTransition />

            {/* ──── PRICING SECTION ──── */}
            <section className="py-24" id="pricing">
                <div className="max-w-6xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400/10 rounded-full mb-6">
                            <span className="text-sm font-medium text-black/60">Transparent Pricing</span>
                        </div>
                        <h2 className="text-4xl font-bold text-black">
                            Plans that scale with you<span className="text-yellow-400">.</span>
                        </h2>
                        <p className="text-black/40 mt-4 max-w-xl mx-auto">
                            Choose a plan that fits your logistics volume. Upgrade or downgrade anytime.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {tiers.map((tier, i) => (
                            <motion.div
                                key={tier.name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
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
                                <h3 className={`text-lg font-bold ${tier.highlighted ? "text-white" : "text-black"}`}>
                                    {tier.name}
                                </h3>
                                <p className={`text-sm mt-1 ${tier.highlighted ? "text-white/50" : "text-black/40"}`}>
                                    {tier.description}
                                </p>
                                <div className="mt-6 mb-8">
                                    <span className={`text-4xl font-bold ${tier.highlighted ? "text-white" : "text-black"}`}>
                                        {tier.price}
                                    </span>
                                    <span className={`text-sm ${tier.highlighted ? "text-white/40" : "text-black/30"}`}>
                                        {tier.period}
                                    </span>
                                </div>
                                <ul className="space-y-3 mb-8">
                                    {tier.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-3">
                                            <svg className={`w-5 h-5 mt-0.5 flex-shrink-0 ${tier.highlighted ? "text-yellow-400" : "text-yellow-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className={`text-sm ${tier.highlighted ? "text-white/70" : "text-black/50"}`}>
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={() => handleSelectPlan(tier.name, tier.price)}
                                    className={`w-full py-3 rounded-full font-semibold transition-all duration-300 ${tier.highlighted ? "bg-yellow-400 text-black hover:bg-yellow-300" : "bg-black/5 text-black hover:bg-black/10"
                                        }`}
                                >
                                    {tier.highlighted ? "Get Started" : tier.price === "Custom" ? "Contact Sales" : "Get Started"}
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ──── CONTACT FORM ──── */}
            <section className="relative py-24 bg-black/[0.02] overflow-hidden" id="contact">
                {/* Animated network background */}
                <NetworkCanvas />
                <div className="relative z-10 max-w-4xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        {/* Left: Info */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-4xl font-bold text-black">
                                Get in touch<span className="text-yellow-400">.</span>
                            </h2>
                            <p className="text-black/40 mt-4 leading-relaxed">
                                Ready to streamline your logistics? Fill out the form and our team
                                will set up your enterprise account within 24 hours.
                            </p>

                            <div className="mt-8 space-y-5">
                                {[
                                    { label: "Onboarding", desc: "We set up and configure your account — no self-registration needed." },
                                    { label: "Dedicated Support", desc: "Your point of contact for training, API integration, and ongoing support." },
                                    { label: "Custom Pricing", desc: "Enterprise plans tailored to your specific volume and requirements." },
                                ].map((item, i) => (
                                    <motion.div
                                        key={item.label}
                                        initial={{ opacity: 0, y: 15 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
                                        className="flex gap-4"
                                    >
                                        <div className="w-8 h-8 bg-yellow-400/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="w-4 h-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-black text-sm">{item.label}</p>
                                            <p className="text-xs text-black/40 mt-0.5">{item.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Right: Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="card p-8"
                        >
                            {formSubmitted ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-12"
                                >
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-black">Message Sent!</h3>
                                    <p className="text-sm text-black/40 mt-2">Our team will reach out within 24 hours.</p>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleContactSubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-black/60 mb-2">Company Name</label>
                                        <input
                                            type="text"
                                            value={contactForm.company}
                                            onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                                            className="input-field"
                                            placeholder="Acme Corporation"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-black/60 mb-2">Work Email</label>
                                        <input
                                            type="email"
                                            value={contactForm.email}
                                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                            className="input-field"
                                            placeholder="you@company.com"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-black/60 mb-2">Service Type</label>
                                        <select
                                            value={contactForm.service}
                                            onChange={(e) => setContactForm({ ...contactForm, service: e.target.value })}
                                            className="input-field cursor-pointer"
                                            required
                                        >
                                            <option value="">Select a service</option>
                                            <option value="international">International Freight</option>
                                            <option value="domestic">Domestic Delivery</option>
                                            <option value="last-mile">Last Mile</option>
                                            <option value="enterprise">Enterprise / Custom</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-black/60 mb-2">Message</label>
                                        <textarea
                                            value={contactForm.message}
                                            onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                                            className="input-field min-h-[120px] resize-none"
                                            placeholder="Tell us about your logistics needs..."
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="w-full btn-primary py-3.5 text-center">
                                        Send Message
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    </div>
                </div>
            </section>


        </div>
    );
}
