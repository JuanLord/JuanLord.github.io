import type { LucideIcon } from "lucide-react";

interface PlaceholderActionProps {
  children: string;
  icon: LucideIcon;
}

export function PlaceholderAction({
  children,
  icon: Icon,
}: PlaceholderActionProps) {
  return (
    <button
      aria-describedby="placeholder-action-note"
      className="action-link action-link-disabled"
      disabled
      title="Placeholder content will be connected later"
      type="button"
    >
      {children}
      <Icon aria-hidden size={18} strokeWidth={1.8} />
    </button>
  );
}
