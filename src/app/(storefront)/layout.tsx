import { LeadCaptureProvider } from "@/components/lead/lead-capture-provider";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LeadCaptureProvider>
      <div className="flex min-h-full flex-1 flex-col">
        <SiteHeader />
        <main className="flex flex-1 flex-col">{children}</main>
        <SiteFooter />
      </div>
    </LeadCaptureProvider>
  );
}
