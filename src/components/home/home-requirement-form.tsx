import { RequirementForm } from "@/components/lead/requirement-form";

export function HomeRequirementForm() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <div>
          <p className="text-sm font-medium text-brand-navy">Customer requirement</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-brand-navy">
            Tell us what you need
          </h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
            Share your budget, use-case and preferred category. Our team will suggest new or
            refurbished options and get back to you. You stay on this page after you submit.
          </p>
        </div>
        <div className="border border-border p-5">
          <RequirementForm idPrefix="home-requirement" submitLabel="Submit requirement" />
        </div>
      </div>
    </section>
  );
}
