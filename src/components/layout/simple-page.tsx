import type { Metadata } from "next";

type SimplePageProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export function SimplePage({ title, description, children }: SimplePageProps) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
      <div className="mt-6 space-y-3 text-sm leading-6 text-muted-foreground [&_h2]:mt-6 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-foreground [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
        {children}
      </div>
    </div>
  );
}

export function simpleMetadata(title: string, description: string): Metadata {
  return { title, description };
}
