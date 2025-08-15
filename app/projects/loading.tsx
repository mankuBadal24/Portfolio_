import Section from "@/components/Section";
import Container from "@/components/Container";
import { RepoGridSkeleton } from "@/components/Skeletons";

export default function Loading() {
  return (
    <Section title="Projects">
      <Container>
        <RepoGridSkeleton count={9} />
      </Container>
    </Section>
  );
}
