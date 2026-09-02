import type { Metadata } from "next";

import { ReviewsScreen } from "@/components/admin/screens/reviews-screen";

export const metadata: Metadata = { title: "Reviews" };

export default function AdminReviewsPage() {
  return <ReviewsScreen />;
}
