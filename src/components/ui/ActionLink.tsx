import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface ActionLinkProps {
  children: string;
  icon: LucideIcon;
  to: string;
  variant?: "primary" | "secondary";
}

export function ActionLink({
  children,
  icon: Icon,
  to,
  variant = "secondary",
}: ActionLinkProps) {
  return (
    <Link className={`action-link action-link-${variant}`} to={to}>
      {children}
      <Icon aria-hidden size={18} strokeWidth={1.8} />
    </Link>
  );
}
