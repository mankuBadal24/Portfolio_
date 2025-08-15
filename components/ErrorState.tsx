export default function ErrorState({
  title = "Something went wrong",
  message,
  cta
}: {
  title?: string;
  message?: string;
  cta?: React.ReactNode;
}) {
  return (
    <div className="card p-6 text-center">
      <h3 className="font-heading text-lg mb-2">{title}</h3>
      {message && <p className="opacity-80 mb-4">{message}</p>}
      {cta}
    </div>
  );
}
