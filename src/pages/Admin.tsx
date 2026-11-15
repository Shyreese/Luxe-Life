import { useCallback, useEffect, useState, type FormEvent } from "react";
import { supabase } from "../utils/supabase";

type ResidentStatus = "pending" | "active" | "ended";

type Resident = {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  property_name: string;
  move_in: string | null;
  stay_end: string | null;
  status: ResidentStatus;
};

type ResidentForm = Omit<Resident, "id"> & { id?: string };

const EMPTY_FORM: ResidentForm = {
  email: "",
  full_name: "",
  phone: "",
  property_name: "The Sacramento Condo",
  move_in: "",
  stay_end: "",
  status: "pending",
};

const inputClass =
  "mt-1 min-h-11 w-full rounded-lg border border-tan bg-white px-3 py-2 text-[15px] text-ink focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20";

function displayDate(value: string | null) {
  if (!value) return "Not set";
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function Admin() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [form, setForm] = useState<ResidentForm>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadResidents = useCallback(async () => {
    setLoading(true);
    setError("");
    const { data, error: queryError } = await supabase
      .from("residents")
      .select("id, email, full_name, phone, property_name, move_in, stay_end, status")
      .order("full_name");

    if (queryError) {
      setError(`Could not load resident records: ${queryError.message}`);
    } else {
      setResidents((data ?? []) as Resident[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadResidents();
  }, [loadResidents]);

  function updateField<K extends keyof ResidentForm>(key: K, value: ResidentForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function editResident(resident: Resident) {
    setForm({ ...resident });
    setNotice("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setNotice("");
    setError("");
  }

  async function saveResident(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    const payload = {
      email: form.email.trim().toLowerCase(),
      full_name: form.full_name.trim(),
      phone: form.phone?.trim() || null,
      property_name: form.property_name.trim(),
      move_in: form.move_in || null,
      stay_end: form.stay_end || null,
      status: form.status,
    };

    const saveResult = form.id
      ? await supabase.from("residents").update(payload).eq("id", form.id)
      : await supabase.from("residents").insert(payload);
    const saveError = saveResult.error;

    if (saveError) {
      setError(
        `Could not save this resident: ${saveError.message}. Confirm the latest resident admin policies have been applied in Supabase, then sign out and back in.`,
      );
      setSaving(false);
      return;
    }

    setNotice(form.id ? "Resident details updated." : "Resident added.");
    setForm(EMPTY_FORM);
    await loadResidents();
    setSaving(false);
  }

  async function signOut() {
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) setError(`Could not sign out: ${signOutError.message}`);
  }

  return (
    <main className="min-h-screen bg-cream px-5 py-10 text-ink md:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-terracotta">LuxeLife Properties</p>
            <h1 className="mt-1 text-3xl font-bold">Resident administration</h1>
            <p className="mt-2 max-w-2xl text-body">
              Add confirmed residents and update their contact details, property, stay dates, and portal status.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void signOut()}
            className="min-h-11 rounded-lg border border-tan bg-white px-4 py-2 text-sm font-semibold hover:bg-card"
          >
            Sign out
          </button>
        </header>

        {error && <p role="alert" className="mb-5 rounded-lg bg-red-50 p-4 text-sm text-red-800">{error}</p>}
        {notice && <p role="status" className="mb-5 rounded-lg bg-sage/30 p-4 text-sm text-ink">{notice}</p>}

        <section className="mb-10 rounded-2xl bg-white p-5 shadow-sm md:p-7">
          <h2 className="text-xl font-semibold">{form.id ? "Edit resident" : "Add a confirmed resident"}</h2>
          <p className="mt-1 text-sm text-body">
            Use the exact email address the resident will use to receive their sign-in code. Set status to active only after confirming the stay.
          </p>

          <form onSubmit={saveResident} className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium">
              Resident full name
              <input
                className={inputClass}
                value={form.full_name}
                onChange={(event) => updateField("full_name", event.target.value)}
                autoComplete="name"
                required
              />
            </label>
            <label className="text-sm font-medium">
              Sign-in email
              <input
                className={inputClass}
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                autoComplete="email"
                required
              />
            </label>
            <label className="text-sm font-medium">
              Phone
              <input
                className={inputClass}
                type="tel"
                value={form.phone ?? ""}
                onChange={(event) => updateField("phone", event.target.value)}
                autoComplete="tel"
              />
            </label>
            <label className="text-sm font-medium">
              Property
              <input
                className={inputClass}
                value={form.property_name}
                onChange={(event) => updateField("property_name", event.target.value)}
                required
              />
            </label>
            <label className="text-sm font-medium">
              Move-in date
              <input
                className={inputClass}
                type="date"
                value={form.move_in ?? ""}
                onChange={(event) => updateField("move_in", event.target.value)}
              />
            </label>
            <label className="text-sm font-medium">
              Stay end date
              <input
                className={inputClass}
                type="date"
                value={form.stay_end ?? ""}
                min={form.move_in || undefined}
                onChange={(event) => updateField("stay_end", event.target.value)}
              />
            </label>
            <label className="text-sm font-medium md:col-span-2">
              Portal access
              <select
                className={inputClass}
                value={form.status}
                onChange={(event) => updateField("status", event.target.value as ResidentStatus)}
              >
                <option value="pending">Pending confirmation</option>
                <option value="active">Active resident</option>
                <option value="ended">Stay ended</option>
              </select>
            </label>
            <div className="flex flex-wrap gap-3 pt-2 md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="min-h-11 rounded-lg bg-terracotta px-5 py-2 font-semibold text-white hover:bg-terracotta-deep disabled:opacity-60"
              >
                {saving ? "Saving..." : form.id ? "Save changes" : "Add resident"}
              </button>
              {form.id && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="min-h-11 rounded-lg border border-tan px-5 py-2 font-semibold hover:bg-card"
                >
                  Cancel editing
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-sm md:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Residents</h2>
            <button
              type="button"
              onClick={() => void loadResidents()}
              disabled={loading}
              className="min-h-11 rounded-lg border border-tan px-4 py-2 text-sm font-semibold hover:bg-card disabled:opacity-60"
            >
              Refresh list
            </button>
          </div>
          {loading ? (
            <p className="py-8 text-sm text-body">Loading residents...</p>
          ) : residents.length === 0 ? (
            <p className="py-8 text-sm text-body">No resident records yet.</p>
          ) : (
            <div className="mt-4 divide-y divide-tan">
              {residents.map((resident) => (
                <article key={resident.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
                  <div>
                    <h3 className="font-semibold">{resident.full_name}</h3>
                    <p className="text-sm text-body">
                      {resident.email}{resident.phone ? `, ${resident.phone}` : ""}
                    </p>
                    <p className="mt-1 text-sm text-body">
                      {resident.property_name}, {displayDate(resident.move_in)} to {displayDate(resident.stay_end)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-card px-3 py-1 text-xs font-semibold capitalize">{resident.status}</span>
                    <button
                      type="button"
                      onClick={() => editResident(resident)}
                      className="min-h-11 rounded-lg border border-tan px-4 py-2 text-sm font-semibold hover:bg-card"
                    >
                      Edit
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
