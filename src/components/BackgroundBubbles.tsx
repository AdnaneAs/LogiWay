"use client";

import { useEffect, useRef, useState } from "react";

interface Bubble {
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
    opacity: number;
    delay: number;
    duration: number;
}

export default function BackgroundBubbles() {
    const [bubbles, setBubbles] = useState<Bubble[]>([]);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const generated: Bubble[] = [];
        for (let i = 0; i < 18; i++) {
            generated.push({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 200 + 40,
                color: i % 4 === 0 ? "#000000" : "#FACC15",
                opacity: i % 4 === 0 ? 0.03 : Math.random() * 0.08 + 0.04,
                delay: Math.random() * 5,
                duration: Math.random() * 4 + 6,
            });
        }
        setBubbles(generated);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({
                x: (e.clientX / window.innerWidth - 0.5) * 30,
                y: (e.clientY / window.innerHeight - 0.5) * 30,
            });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 overflow-hidden pointer-events-none"
            style={{ zIndex: -10 }}
        >
            {bubbles.map((bubble) => (
                <div
                    key={bubble.id}
                    className="absolute rounded-full"
                    style={{
                        left: `${bubble.x}%`,
                        top: `${bubble.y}%`,
                        width: `${bubble.size}px`,
                        height: `${bubble.size}px`,
                        backgroundColor: bubble.color,
                        opacity: bubble.opacity,
                        filter: `blur(${bubble.size * 0.4}px)`,
                        transform: `translate(${mousePos.x * (bubble.id % 3 === 0 ? 1 : -0.5)}px, ${mousePos.y * (bubble.id % 2 === 0 ? 1 : -0.5)}px)`,
                        transition: "transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                        animation: `floatBubble ${bubble.duration}s ease-in-out ${bubble.delay}s infinite alternate`,
                    }}
                />
            ))}
            <style jsx>{`
        @keyframes floatBubble {
          0% {
            transform: translateY(0px) translateX(0px) scale(1);
          }
          50% {
            transform: translateY(-25px) translateX(15px) scale(1.05);
          }
          100% {
            transform: translateY(10px) translateX(-10px) scale(0.95);
          }
        }
      `}</style>
        </div>
    );
}
