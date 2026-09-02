import { publicEnv } from "@/config/public-env";

export function buildWhatsAppUrl(message: string) {
  const digits = publicEnv.whatsappNumber.replace(/\D/g, "");
  if (!digits) {
    return null;
  }

  const encoded = encodeURIComponent(message);
  return `https://wa.me/${digits}?text=${encoded}`;
}

export function productEnquiryMessage(input: {
  name: string;
  condition?: string;
  grade?: string;
}) {
  const details = [input.name, input.condition, input.grade]
    .filter(Boolean)
    .join(" – ");
  return `Hi GadgetCenter, I am interested in ${details}.`;
}
