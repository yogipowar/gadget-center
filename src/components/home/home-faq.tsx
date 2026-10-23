const faqs = [
  {
    question: "Are these laptops new or refurbished?",
    answer:
      "The current catalog is refurbished Dell and HP business laptops. Each listing is labelled refurbished. We do not mark a device as new unless the catalog says so.",
  },
  {
    question: "What is included with the laptop?",
    answer:
      "Adapter is included. RAM and SSD are as listed on each product. Unless a listing says otherwise, the default is 8GB RAM and 256GB M.2 NVMe SSD.",
  },
  {
    question: "Is warranty included?",
    answer:
      "Warranty is shown on each product from our catalog data. If a listing has no warranty value, we do not claim one.",
  },
  {
    question: "Can I get help before buying?",
    answer:
      "Yes. Use Get Expert Help, WhatsApp, or the contact page. Share your budget, preferred brand and the model you want.",
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
      <h2 className="border-b border-border pb-2 text-lg font-semibold text-brand-navy">
        Frequently asked questions
      </h2>
      <div className="mt-2 divide-y divide-border">
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
