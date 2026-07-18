import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Container } from "./Container";

interface PageIntroProps {
  actions?: ReactNode;
  children: ReactNode;
  eyebrow: string;
  index: string;
  title: string;
}

export function PageIntro({
  actions,
  children,
  eyebrow,
  index,
  title,
}: PageIntroProps) {
  return (
    <section className="page-intro">
      <Container className="page-intro-inner">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="page-intro-heading"
          initial={{ opacity: 0, y: 14 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <p className="module-eyebrow">
            <span>{index}</span>
            {eyebrow}
          </p>
          <h1>{title}</h1>
        </motion.div>
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="page-intro-summary"
          initial={{ opacity: 0, y: 14 }}
          transition={{ delay: 0.08, duration: 0.4, ease: "easeOut" }}
        >
          {children}
          {actions ? <div className="page-intro-actions">{actions}</div> : null}
        </motion.div>
      </Container>
    </section>
  );
}
