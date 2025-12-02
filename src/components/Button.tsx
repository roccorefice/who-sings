import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    className?: string;
}

const variantClasses = {
    primary: "bg-mmx-orange text-white hover:brightness-110",
    secondary: "bg-neutral-800 text-white hover:bg-neutral-700",
    ghost: "bg-black/50 text-white hover:bg-neutral-700",
};

const sizeClasses = {
    sm: "px-3 py-1 text-sm",
    md: "px-6 py-3",
    lg: "px-6 py-3 md:h-16",
};

export function Button({
    children,
    variant = "primary",
    size = "md",
    fullWidth = false,
    className = "",
    disabled,
    ...props
}: ButtonProps) {
    const baseClasses = "rounded-xl font-medium transition disabled:opacity-40 disabled:cursor-not-allowed";
    const widthClass = fullWidth ? "w-full" : "w-auto";
    const variantClass = variantClasses[variant];
    const sizeClass = sizeClasses[size];

    return (
        <button
            className={`${baseClasses} ${variantClass} ${sizeClass} ${widthClass} ${className}`}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
}