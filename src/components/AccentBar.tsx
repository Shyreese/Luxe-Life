export default function AccentBar({ tone = "default" }: { tone?: "default" | "light" }) {
  return <span className={`mb-4 block h-[3px] w-12 ${tone === "light" ? "bg-white/70" : "bg-terracotta/60"}`} />;
}
