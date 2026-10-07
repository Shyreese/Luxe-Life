// DEMO DATA ONLY. Replace with Supabase before launch. Never put real codes here.

export const PROPERTY_NAME = "The Sacramento Condo";
export const PROPERTY_ADDRESS = "North Natomas, Sacramento, CA 95835"; // replace with real street address from owner

export const RESIDENT = {
  fullName: "Joe Smith",
  firstName: "Joe",
  initials: "JS",
};

export const MANAGER = {
  name: "Amy Flatt",
  firstName: "Amy",
  email: "amy@luxelifeproperties.example",
};

// Set to an image URL or import to display a photo instead of initials
export const PROPERTY_MANAGER_PHOTO: string | null = null;

export const MANAGER_MAILTO = `mailto:${MANAGER.email}`;

export function managerMailto(subject: string) {
  return `${MANAGER_MAILTO}?subject=${encodeURIComponent(subject)}`;
}

export const ISSUE_MAILTO = managerMailto(`Issue at ${PROPERTY_NAME}`);
export const EXTEND_MAILTO = managerMailto(`Extend my stay at ${PROPERTY_NAME}`);

export const PHONE = {
  display: "(916) 555 0142",
  tel: "tel:+19165550142",
};

export const PRICING = {
  from: "From $4,000 per month",
  perNight: "About $133 per night",
  seasonNote: "Rates vary by season",
  minimum: "30 day minimum",
  monthlyRate: "$4,000",
};

export const COMPARE_HOTEL_MONTHLY = "Approximately $8,900 per month";

export const PARKING = {
  space: "space 18",
  summary: "Parking, garage, space 18",
  walkthrough: "Parking is included in the garage at space 18.",
};

export const PRICING_NOTES = [PRICING.seasonNote, PRICING.perNight, PRICING.minimum];

// One demo stay used on every page. Months are zero based.
export const STAY = {
  moveIn: new Date(2026, 8, 18),
  end: new Date(2026, 9, 30),
  lengthLabel: "6 weeks",
  walkthroughReminder: "October 17",
};

const MS_PER_DAY = 86_400_000;

export function formatLongDate(d: Date) {
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export const MOVE_IN_LABEL = formatLongDate(STAY.moveIn);
export const STAY_END_LABEL = formatLongDate(STAY.end);

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function getStayProgress(today: Date = new Date()) {
  const start = startOfDay(STAY.moveIn).getTime();
  const end = startOfDay(STAY.end).getTime();
  const now = startOfDay(today).getTime();
  const totalDays = Math.round((end - start) / MS_PER_DAY);
  const daysSettled = Math.min(Math.max(Math.round((now - start) / MS_PER_DAY), 0), totalDays);
  return { totalDays, daysSettled, daysRemaining: totalDays - daysSettled };
}

export function pluralDays(n: number) {
  return n === 1 ? "1 day" : `${n} days`;
}

export const ACCESS = [
  { label: "Stay ends", value: STAY_END_LABEL, secret: false },
  { label: "Building entrance code", value: "4827", secret: true },
  { label: "Unit door code", value: "29 5581", secret: true },
  { label: "Wifi network", value: "LuxeLife Guest", secret: false },
  { label: "Wifi password", value: "welcome2100", secret: true },
];

export const LEASE_PDF = "/documents/signed-lease-agreement.pdf";

export const DOCUMENTS = [
  { label: "Signed lease agreement", href: LEASE_PDF },
  { label: "Payment receipt, September 2026", href: "/documents/payment-receipt-september-2026.pdf" },
  { label: "Move in walkthrough summary", href: "/documents/move-in-walkthrough-summary.pdf" },
];

export const INQUIRY_SUMMARY = {
  property: PROPERTY_NAME,
  stayFor: "Yourself",
  moveIn: MOVE_IN_LABEL,
  length: STAY.lengthLabel,
};

export function formatIsoDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return y && m && d ? formatLongDate(new Date(y, m - 1, d)) : "";
}

export function generateRequestId() {
  return `LL 2026 ${Math.floor(1000 + Math.random() * 9000)}`;
}

export const DEMO_REQUEST_ID = "LL 2026 0428";

export const CONFIRMED_STAY = [
  { label: "Property", value: PROPERTY_NAME },
  { label: "Address", value: PROPERTY_ADDRESS },
  { label: "Move in date", value: MOVE_IN_LABEL },
  { label: "Length of stay", value: STAY.lengthLabel },
];

export const SIGN_IN_RULES = {
  validCode: "123456",
  expiredCode: "000000",
  knownEmailContains: "test",
  newResidentEmail: "new@test.com",
};

export const NEARBY = [
  { name: "Maestro Coffee House", type: "Coffee shop", address: "2069 Arena Blvd", category: "Coffee" },
  { name: "68th Street Cafe", type: "Vietnamese cafe", address: "4261 Truxel Rd", category: "Coffee" },
  { name: "Bella Bru Cafe", type: "Cafe and breakfast", address: "4680 Natomas Blvd", category: "Coffee" },
  { name: "Fukumi Ramen", type: "Ramen", address: "4630 Natomas Blvd", category: "Food" },
  { name: "El Tito Modern Kitchen", type: "Mexican", address: "2960 Del Paso Rd", category: "Food" },
  { name: "charQterie", type: "Wine bar and charcuterie", address: "4112 E Commerce Way", category: "Food" },
  { name: "North Natomas Regional Park", type: "Park and trails", address: "4989 Natomas Blvd", category: "Parks" },
  { name: "Valley Oak Park", type: "Park and dog park", address: "2780 Mabry Dr", category: "Parks" },
  { name: "Northborough Park", type: "Neighborhood park", address: "2300 Club Center Dr", category: "Parks" },
  { name: "North Natomas Library", type: "Library with quiet rooms", address: "4660 Via Ingoglia St", category: "Work spots" },
  { name: "Maestro Coffee House", type: "Cafe with fast wifi", address: "2069 Arena Blvd", category: "Work spots" },
  { name: "Sutter Walk In Care", type: "Walk in clinic", address: "2860 Del Paso Rd", category: "Health" },
  { name: "Carbon Health Urgent Care Natomas", type: "Urgent care", address: "4112 E Commerce Way", category: "Health" },
  { name: "Natomas Pharmacy", type: "Pharmacy", address: "4321 Truxel Rd", category: "Health" },
];

export const REMINDERS = [
  `Your monthly walkthrough with ${MANAGER.name} is on ${STAY.walkthroughReminder}.`,
  "Your rent auto pay processes on the first of each month.",
];

export const QUICK_ANSWERS = [
  {
    q: "How do I pay rent?",
    a: "Rent is paid through your Resident Hub. Auto pay processes on the first of each month.",
  },
  {
    q: "What if I am locked out?",
    a: `Message ${MANAGER.firstName} any time and she will help you get back in. Your door code is also in your access details above.`,
  },
  {
    q: "Who do I contact for maintenance?",
    a: `Use Report an issue on your property card and ${MANAGER.firstName} will coordinate a fix.`,
  },
];
