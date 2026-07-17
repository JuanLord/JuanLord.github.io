import { ArrowLeft } from "lucide-react";
import { ActionLink } from "../components/ui/ActionLink";
import { Container } from "../components/ui/Container";

export function NotFoundPage() {
  return (
    <section className="module-page">
      <Container className="not-found">
        <p className="section-index">Error / 404</p>
        <h1>Route not found.</h1>
        <p>The requested portfolio path is not part of this build.</p>
        <ActionLink icon={ArrowLeft} to="/" variant="primary">
          Return home
        </ActionLink>
      </Container>
    </section>
  );
}
