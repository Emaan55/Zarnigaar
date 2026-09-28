export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="border-b border-border bg-beige/40 py-12">
      <div className="container-page text-center">
        <h1 className="font-heading text-3xl sm:text-4xl">{title}</h1>
        {description && <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
}
