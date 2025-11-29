import type { ReactNode } from "react";

interface CardProps {
    children: ReactNode;
    className?: string;
    padding?: "sm" | "md" | "lg" | "xl";
    shadow?: boolean;
}

const paddingClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    xl: "p-10",
};

export function Card({
    children,
    className = "",
    padding = "lg",
    shadow = true
}: CardProps) {
    const baseClasses = "bg-mmx-card rounded-2xl";
    const paddingClass = paddingClasses[padding];
    const shadowClass = shadow ? "box-shadow" : "";

    return (
        <div className={`${baseClasses} ${paddingClass} ${shadowClass} ${className}`}>
            {children}
        </div>
    );
}