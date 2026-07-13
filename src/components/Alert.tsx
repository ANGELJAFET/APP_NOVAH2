import { ReactNode } from "react";

type AlertVariant = "error" | "success" | "warning";

interface AlertProps {
  variant?: AlertVariant;
  children: React.ReactNode;
}

const VARIANT_STYLES: Record<AlertVariant, { wrapper: string; badge: string }> = {
  error: {
    wrapper: "border-red-100 bg-red-50 text-red-800",
    badge: "bg-red-500",
  },
  success: {
    wrapper: "border-emerald-100 bg-emerald-50 text-emerald-800",
    badge: "bg-emerald-500",
  },
  warning: {
    wrapper: "border-amber-100 bg-amber-50 text-amber-900",
    badge: "bg-amber-500",
  },
};

const VARIANT_ICONS: Record<AlertVariant, ReactNode> = {
  error: (
    <>
      <rect x="9" y="4.5" width="2" height="6.5" rx="1" />
      <circle cx="10" cy="14" r="1.15" />
    </>
  ),
  warning: (
    <>
      <rect x="9" y="4.5" width="2" height="6.5" rx="1" />
      <circle cx="10" cy="14" r="1.15" />
    </>
  ),
  success: <path d="M5.5 10.3l2.8 2.8 6.2-6.2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
};

export function Alert({ variant = "error", children }: AlertProps) {
  const styles = VARIANT_STYLES[variant];
  return (
    <div
      role="alert"
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-sm ${styles.wrapper}`}
    >
      <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${styles.badge}`}>
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3 text-white">
          {VARIANT_ICONS[variant]}
        </svg>
      </span>
      <span className="leading-snug">{children}</span>
    </div>
  );
}
