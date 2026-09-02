import { SimplePage, simpleMetadata } from "@/components/layout/simple-page";

export const metadata = simpleMetadata(
  "About GadgetCenter",
  "GadgetCenter sells laptops, computers and a full range of related electronics for homes and offices.",
);

export default function AboutPage() {
  return (
    <SimplePage
      title="About GadgetCenter"
      description="We started with laptops and computers, and we also supply the rest of the electronics a home or office needs."
    >
      <p>
        Core range: new and refurbished laptops, desktops, custom PC builds, monitors, storage, RAM,
        printers, UPS, keyboards, mice, cables and networking products.
      </p>
      <p>
        Also available: CCTV cameras and surveillance installation, home electronics appliances, pro
        audio equipment, robotics and EOT kits, plus service, repair and AMC.
      </p>
      <p>
        Refurbished computers show a condition grade and the warranty stored for that product. We do
        not invent warranty or ratings.
      </p>
    </SimplePage>
  );
}
