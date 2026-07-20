import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Container } from "../ui/Container";
import { MockBadge } from "../ui/MockBadge";

interface CreativeSectionHeaderProps {
  eyebrow: string;
  title: string;
  introduction: string;
  backTo?: string;
  backLabel?: string;
}

export function CreativeSectionHeader({
  eyebrow,
  title,
  introduction,
  backTo,
  backLabel = "Creative index",
}: CreativeSectionHeaderProps) {
  return (
    <header className="creative-section-header">
      <Container className="creative-section-header-inner">
        <div className="creative-section-header-copy">
          {backTo ? (
            <Link className="creative-back-link" to={backTo}>
              <ArrowLeft aria-hidden size={16} />
              {backLabel}
            </Link>
          ) : null}
          <p className="creative-kicker">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{introduction}</p>
        </div>
        <MockBadge />
      </Container>
    </header>
  );
}
