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
    secondary: "bg-white/80 text-black hover:bg-white/100",
    ghost: "bg-black/70 text-white hover:bg-black/20",
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
    const baseClasses = "rounded-xl font-medium transition disabled:opacity-40 disabled:cursor-not-allowed border-none ";
    const widthClass = fullWidth ? "w-full" : "";
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