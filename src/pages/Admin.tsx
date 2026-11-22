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

type ResidentDocumentType = "lease" | "payment-receipt";

type ResidentDocument = {
  type: ResidentDocumentType;
  signedUrl: string;
};

type PendingDocuments = Partial<Record<ResidentDocumentType, File>>;

const DOCUMENT_BUCKET = "resident-documents";
const MAX_DOCUMENT_SIZE = 15 * 1024 * 1024;
const RESIDENT_DOCUMENT_TYPES: {
  type: ResidentDocumentType;
  label: string;
  fileName: string;
}[] = [
  { type: "lease", label: "Lease", fileName: "lease.pdf" },
  { type: "payment-receipt", label: "Payment receipt", fileName: "payment-receipt.pdf" },
];

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
  const [documents, setDocuments] = useState<ResidentDocument[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [documentError, setDocumentError] = useState("");
  const [pendingFiles, setPendingFiles] = useState<PendingDocuments>({});

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
    setPendingFiles({});
    setDocuments([]);
    setDocumentError("");
    void loadDocuments(resident.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setNotice("");
    setError("");
    setDocuments([]);
    setDocumentError("");
    setPendingFiles({});
  }

  async function loadDocuments(residentId: string) {
    setDocumentsLoading(true);
    setDocumentError("");
    setDocuments([]);
    const storage = supabase.storage.from(DOCUMENT_BUCKET);
    const { data, error: listError } = await storage.list(residentId, { limit: 100 });

    if (listError) {
      setDocumentError(`Could not load resident documents: ${listError.message}`);
      setDocumentsLoading(false);
      return;
    }

    const files = new Set((data ?? []).map((file) => file.name));
    const signedDocuments: ResidentDocument[] = [];
    for (const documentType of RESIDENT_DOCUMENT_TYPES) {
      if (!files.has(documentType.fileName)) continue;
      const path = `${residentId}/${documentType.fileName}`;
      const { data: signedData, error: signedError } = await storage.createSignedUrl(path, 60);
      if (signedError) {
        setDocumentError(
          `Could not create a secure link for the ${documentType.label.toLowerCase()}: ${signedError.message}`,
        );
        setDocumentsLoading(false);
        return;
      }
      signedDocuments.push({ type: documentType.type, signedUrl: signedData.signedUrl });
    }

    setDocuments(signedDocuments);
    setDocumentsLoading(false);
  }

  function addDocument(type: ResidentDocumentType, file: File | undefined) {
    if (!file) return;
    if (
      (file.type && file.type !== "application/pdf") ||
      !file.name.toLowerCase().endsWith(".pdf") ||
      file.size > MAX_DOCUMENT_SIZE
    ) {
      setDocumentError(
        `${file.name} is not supported. Choose a PDF no larger than 15 MB.`,
      );
      return;
    }
    setDocumentError("");
    setPendingFiles((current) => ({ ...current, [type]: file }));
  }

  async function uploadDocuments(residentId: string) {
    const storage = supabase.storage.from(DOCUMENT_BUCKET);
    const failedFiles: PendingDocuments = {};
    const failures: string[] = [];

    for (const documentType of RESIDENT_DOCUMENT_TYPES) {
      const file = pendingFiles[documentType.type];
      if (!file) continue;
      const path = `${residentId}/${documentType.fileName}`;
      const { error: uploadError } = await storage.upload(path, file, {
        contentType: "application/pdf",
        upsert: true,
      });
      if (uploadError) {
        failedFiles[documentType.type] = file;
        failures.push(`${documentType.label}: ${uploadError.message}`);
      }
    }

    setPendingFiles(failedFiles);
    return failures;
  }

  async function deleteDocument(type: ResidentDocumentType) {
    setDocumentError("");
    const documentType = RESIDENT_DOCUMENT_TYPES.find((item) => item.type === type);
    if (!documentType || !form.id) return;
    const { error: deleteError } = await supabase.storage
      .from(DOCUMENT_BUCKET)
      .remove([`${form.id}/${documentType.fileName}`]);
    if (deleteError) {
      setDocumentError(`Could not delete this document: ${deleteError.message}`);
      return;
    }
    await loadDocuments(form.id);
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

    let residentId = form.id;
    let saveError: Error | null;
    if (form.id) {
      const saveResult = await supabase.from("residents").update(payload).eq("id", form.id);
      saveError = saveResult.error;
    } else {
      const saveResult = await supabase.from("residents").insert(payload).select("id").single();
      saveError = saveResult.error;
      residentId = saveResult.data?.id;
    }

    if (saveError || !residentId) {
      setError(
        `Could not save this resident: ${saveError?.message ?? "No resident ID was returned"}. Confirm the latest resident admin policies have been applied in Supabase, then sign out and back in.`,
      );
      setSaving(false);
      return;
    }

    const documentFailures = await uploadDocuments(residentId);
    if (documentFailures.length > 0) {
      setForm({ ...payload, id: residentId });
      await loadDocuments(residentId);
      await loadResidents();
      setError(
        `Resident details were saved, but these documents could not be uploaded: ${documentFailures.join("; ")}`,
      );
      setSaving(false);
      return;
    }

    setNotice(form.id ? "Resident details updated." : "Resident added.");
    setForm(EMPTY_FORM);
    setDocuments([]);
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
              Add resident stays, manage their contact details and stay dates, and attach stay-specific documents.
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
          <h2 className="text-xl font-semibold">{form.id ? "Edit resident stay" : "Add a resident stay"}</h2>
          <p className="mt-1 text-sm text-body">
            Use the resident's sign-in email. Add a new stay for returning residents instead of changing a previous stay. Set status to active only after confirming the stay.
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
            <div className="md:col-span-2">
              <h3 className="text-sm font-semibold">Stay documents</h3>
              <p className="mt-1 text-sm text-body">
                Add a lease and payment receipt for this stay. PDFs are limited to 15 MB. The resident can view them while the stay is active or ended.
              </p>
              {documentsLoading ? (
                <p className="mt-3 text-sm text-body">Loading saved documents...</p>
              ) : null}
              <div className="mt-3 grid gap-4 md:grid-cols-2">
                {RESIDENT_DOCUMENT_TYPES.map((documentType) => {
                  const savedDocument = documents.find((document) => document.type === documentType.type);
                  const selectedFile = pendingFiles[documentType.type];
                  return (
                    <div key={documentType.type} className="rounded-lg border border-tan p-3">
                      <label className="block text-sm font-medium">
                        {documentType.label} (PDF)
                        <input
                          className={inputClass}
                          type="file"
                          accept=".pdf,application/pdf"
                          disabled={saving}
                          onChange={(event) => {
                            addDocument(documentType.type, event.currentTarget.files?.[0]);
                            event.currentTarget.value = "";
                          }}
                        />
                      </label>
                      {savedDocument && (
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                          <a
                            href={savedDocument.signedUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm font-medium text-navy underline"
                          >
                            View saved {documentType.label.toLowerCase()}
                          </a>
                          <button
                            type="button"
                            onClick={() => void deleteDocument(documentType.type)}
                            disabled={saving}
                            className="min-h-11 rounded-lg border border-tan px-3 py-2 text-sm font-semibold hover:bg-card"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                      {selectedFile && (
                        <div className="mt-2 flex items-center justify-between gap-2 text-sm text-body">
                          <span className="break-all">{selectedFile.name} (will upload on save)</span>
                          <button
                            type="button"
                            onClick={() =>
                              setPendingFiles((current) => {
                                const next = { ...current };
                                delete next[documentType.type];
                                return next;
                              })
                            }
                            disabled={saving}
                            className="min-h-11 px-2 font-semibold text-navy underline"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {documentError && (
                <p role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-800">
                  {documentError}
                </p>
              )}
              {!form.id && (
                <p className="mt-2 text-xs text-body">New files upload securely after you add the stay.</p>
              )}
            </div>
            <div className="flex flex-wrap gap-3 pt-2 md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="min-h-11 rounded-lg bg-terracotta px-5 py-2 font-semibold text-white hover:bg-terracotta-deep disabled:opacity-60"
              >
                {saving ? "Saving..." : form.id ? "Save changes" : "Add stay"}
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
            <h2 className="text-xl font-semibold">Resident stays</h2>
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
