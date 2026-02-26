export default function SkeletonLoader({
    className = "",
    count = 1,
}: {
    className?: string;
    count?: number;
}) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className={`animate-pulse bg-black/5 rounded-lg ${className}`}
                />
            ))}
        </>
    );
}
