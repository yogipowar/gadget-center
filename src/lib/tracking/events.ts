export const ANALYTICS_EVENTS = {
  PAGE_VIEW: "PageView",
  LEAD: "Lead",
  VIEW_CONTENT: "ViewContent",
  ADD_TO_CART: "AddToCart",
  INITIATE_CHECKOUT: "InitiateCheckout",
  PURCHASE: "Purchase",
  SEARCH: "Search",
  VIEW_CATEGORY: "ViewCategory",
} as const;

export type AnalyticsEventName =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

export type AnalyticsEventPayload = {
  name: AnalyticsEventName;
  contentIds?: string[];
  contentName?: string;
  value?: number;
  currency?: "INR";
  source?: string;
};

export function createAnalyticsEvent(
  name: AnalyticsEventName,
  extras: Omit<AnalyticsEventPayload, "name"> = {},
): AnalyticsEventPayload {
  return {
    name,
    currency: extras.value !== undefined ? "INR" : extras.currency,
    ...extras,
  };
}
