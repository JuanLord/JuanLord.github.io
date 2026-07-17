import { ArrowLeft, Braces } from "lucide-react";
import { motion } from "framer-motion";
import { ActionLink } from "../components/ui/ActionLink";
import { Container } from "../components/ui/Container";
import { MockBadge } from "../components/ui/MockBadge";

interface ModulePreviewPageProps {
  description: string;
  eyebrow: string;
  index: string;
  title: string;
}

export function ModulePreviewPage({
  description,
  eyebrow,
  index,
  title,
}: ModulePreviewPageProps) {
  return (
    <section className="module-page">
      <Container className="module-page-inner">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="module-copy"
          initial={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.35 }}
        >
          <div className="module-eyebrow">
            <span>{index}</span>
            {eyebrow}
          </div>
          <h1>{title}</h1>
          <p>{description}</p>
          <div className="module-actions">
            <ActionLink icon={ArrowLeft} to="/">
              Back home
            </ActionLink>
          </div>
        </motion.div>

        <div className="module-status" aria-label="Module content status">
          <div className="module-status-icon" aria-hidden>
            <Braces size={24} />
          </div>
          <div>
            <p>Content source connected</p>
            <span>Typed mock records are ready for this module.</span>
          </div>
          <MockBadge />
        </div>
      </Container>
    </section>
  );
}
