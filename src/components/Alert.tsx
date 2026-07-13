type AlertVariant = "error" | "success" | "warning";

interface AlertProps {
  variant?: AlertVariant;
  children: React.ReactNode;
}

const VARIANT_STYLES: Record<AlertVariant, string> = {
  error: "border-red-200 bg-red-50 text-red-700",
  success: "border-green-200 bg-green-50 text-green-700",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
};

const VARIANT_ICONS: Record<AlertVariant, string> = {
  error: "⛔",
  success: "✅",
  warning: "⚠️",
};

export function Alert({ variant = "error", children }: AlertProps) {
  return (
    <div
      role="alert"
      className={`flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm ${VARIANT_STYLES[variant]}`}
    >
      <span aria-hidden className="leading-none">
        {VARIANT_ICONS[variant]}
      </span>
      <span>{children}</span>
    </div>
  );
}
