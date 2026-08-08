import type { LucideIcon } from "lucide-react";

interface PlaceholderActionProps {
  children: string;
  describedBy?: string;
  icon: LucideIcon;
}

export function PlaceholderAction({
  children,
  describedBy,
  icon: Icon,
}: PlaceholderActionProps) {
  return (
    <button
      aria-describedby={describedBy}
      className="action-link action-link-disabled"
      disabled
      title="This link is not available yet"
      type="button"
    >
      {children}
      <Icon aria-hidden size={18} strokeWidth={1.8} />
    </button>
  );
}
