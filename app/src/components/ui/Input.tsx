import { type ReactNode, type ChangeEvent } from "react";
import { cn } from "../../lib/cn";

type Size = "sm" | "md" | "lg";

interface InputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  icon?: ReactNode;
  size?: Size;
}

const sizeClasses: Record<Size, string> = {
  sm: "h-8 text-xs px-2.5",
  md: "h-9 text-sm px-3",
  lg: "h-11 text-sm px-4",
};

export function Input({
  value,
  onChange,
  placeholder,
  className,
  icon,
  size = "md",
}: InputProps) {
  return (
    <div
      className={cn(
        "relative flex items-center rounded-lg bg-glass border border-border-subtle",
        "transition-all duration-200",
        "focus-within:border-accent focus-within:shadow-[0_0_0_3px_var(--glow-soft)]",
        sizeClasses[size],
        !!icon && "pl-9",
        className,
      )}
    >
      {icon && (
        <span className="absolute left-2.5 text-muted pointer-events-none flex items-center">
          {icon}
        </span>
      )}
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full h-full bg-transparent placeholder:text-muted"
      />
    </div>
  );
}
