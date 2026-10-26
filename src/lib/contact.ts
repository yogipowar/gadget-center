export function telHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return `tel:+91${digits.replace(/^91/, "")}`;
}

export function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "").replace(/^91/, "");
  return `+91 ${digits}`;
}
