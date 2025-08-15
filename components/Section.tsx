import Container from "./Container";

type Props = {
  id?: string;
  title?: string;
  children: React.ReactNode;
};

export default function Section({ id, title, children }: Props) {
  return (
    <section id={id} className="py-14 sm:py-16 md:py-20">
      <Container>
        {title && (
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl mb-8">
            {title}
          </h2>
        )}
        {children}
      </Container>
    </section>
  );
}
