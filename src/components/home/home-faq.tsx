const faqs = [
  {
    question: "Do you sell both new and refurbished laptops?",
    answer:
      "Yes. New laptops carry brand warranty as listed on each product. Refurbished laptops show condition grade and the warranty stored for that device.",
  },
  {
    question: "Do you only sell laptops?",
    answer:
      "Laptops and computers are the core range. We also supply printers, UPS, monitors, storage, networking, CCTV, home appliances, pro audio, robotics kits, and service/repair.",
  },
  {
    question: "What does refurbished grade mean?",
    answer:
      "Grade A+ and A are lightly used with strong cosmetics. Grade B may show visible wear. We only list devices that have been tested. The grade on the product page is the grade of that listing.",
  },
  {
    question: "Is warranty included?",
    answer:
      "Warranty is shown on each product from our catalog data. If a listing has no warranty value, we do not claim one.",
  },
  {
    question: "Can I get help before buying?",
    answer:
      "Yes. Use Get Expert Help, WhatsApp, or the contact page. Share your budget, preferred brand and whether you need a new or refurbished device.",
  },
  {
    question: "Do you deliver?",
    answer:
      "Delivery options and charges are confirmed at checkout or by our sales team for enquiry orders.",
  },
];

export function HomeFaq() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4">
      <h2 className="text-2xl font-semibold tracking-tight">Frequently asked questions</h2>
      <div className="mt-6 divide-y divide-border rounded-xl border border-border">
        {faqs.map((item) => (
          <details key={item.question} className="group px-4 py-3">
            <summary className="cursor-pointer list-none text-sm font-medium">
              {item.question}
            </summary>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
