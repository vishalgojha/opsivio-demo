"use client";

import { FormEvent, useEffect, useState } from "react";
import { Check, FlaskConical, MapPin, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import {
  createLocationExtractionRule,
  deleteLocationExtractionRule,
  getLocationExtractionRules,
  LocationExtractionRule,
  LocationExtractionRuleInput,
  testLocationExtractionRule,
  updateLocationExtractionRule,
} from "@/lib/api";

const emptyRule: LocationExtractionRuleInput = {
  name: "",
  pattern: "",
  canonical_location: "",
  is_active: true,
  priority: 100,
};

export default function LocationRulesPage() {
  const [rules, setRules] = useState<LocationExtractionRule[]>([]);
  const [form, setForm] = useState<LocationExtractionRuleInput>(emptyRule);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [sample, setSample] = useState("");
  const [testResult, setTestResult] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadRules = () => getLocationExtractionRules().then((data) => setRules(data.rules || []));
  useEffect(() => { loadRules().catch(() => setNotice("Could not load location rules")).finally(() => setLoading(false)); }, []);

  const setField = <K extends keyof LocationExtractionRuleInput>(key: K, value: LocationExtractionRuleInput[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const reset = () => { setForm(emptyRule); setEditingId(null); setTestResult(null); };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      const result = editingId
        ? await updateLocationExtractionRule(editingId, form)
        : await createLocationExtractionRule(form);
      setRules((current) => editingId
        ? current.map((rule) => rule.id === editingId ? result.rule : rule)
        : [result.rule, ...current]);
      setNotice(editingId ? "Location rule updated" : "Location rule added");
      reset();
    } catch (error) { setNotice(error instanceof Error ? error.message : "Could not save location rule"); }
    finally { setSaving(false); }
  };

  const edit = (rule: LocationExtractionRule) => {
    setEditingId(rule.id);
    setForm({ name: rule.name, pattern: rule.pattern, canonical_location: rule.canonical_location, is_active: rule.is_active, priority: rule.priority });
    setTestResult(null);
  };

  const remove = async (rule: LocationExtractionRule) => {
    if (!window.confirm(`Delete “${rule.name}”?`)) return;
    try { await deleteLocationExtractionRule(rule.id); setRules((current) => current.filter((item) => item.id !== rule.id)); setNotice("Location rule deleted"); }
    catch (error) { setNotice(error instanceof Error ? error.message : "Could not delete location rule"); }
  };

  const runTest = async () => {
    try {
      const result = await testLocationExtractionRule(form.pattern, sample);
      setTestResult(result.matched ? `Match: “${result.matched_text}”` : "No match in this sample");
    } catch (error) { setTestResult(error instanceof Error ? error.message : "Regex test failed"); }
  };

  return (
    <main className="min-h-screen bg-[#f5f6f2] text-[#14213d] px-5 py-8 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#1687b8]">Workspace settings</p>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Location extraction rules</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#53657d]">Teach Opsivio how your market names appear in raw WhatsApp posts. A matching rule adds a canonical location to an already source-grounded listing and keeps the original text as evidence.</p>
          </div>
          <div className="rounded-2xl border border-[#d7e0e5] bg-white px-4 py-3 text-xs text-[#53657d] shadow-sm"><MapPin className="mr-2 inline h-4 w-4 text-[#1687b8]" />Tenant-scoped and deterministic</div>
        </div>

        {notice && <div className="mb-5 flex items-center justify-between rounded-xl border border-[#b9dfcf] bg-[#effaf5] px-4 py-3 text-sm text-[#166534]"><span><Check className="mr-2 inline h-4 w-4" />{notice}</span><button onClick={() => setNotice(null)}><X className="h-4 w-4" /></button></div>}

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-2xl border border-[#d7e0e5] bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5 flex items-center justify-between"><div><h2 className="text-lg font-semibold">{editingId ? "Edit rule" : "Add a rule"}</h2><p className="mt-1 text-xs text-[#718096]">Use a named <code className="rounded bg-[#eef3f5] px-1">location</code> capture group when possible.</p></div>{editingId && <button onClick={reset} className="text-xs font-semibold text-[#1687b8]">Cancel</button>}</div>
            <form onSubmit={submit} className="space-y-4">
              <label className="block text-sm font-medium">Rule name<input required maxLength={120} value={form.name} onChange={(e) => setField("name", e.target.value)} placeholder="Bandra mentions" className="mt-1.5 w-full rounded-xl border border-[#cbd5df] bg-[#fbfcfb] px-3 py-2.5 text-sm outline-none focus:border-[#1687b8]" /></label>
              <label className="block text-sm font-medium">Canonical location<input required maxLength={160} value={form.canonical_location} onChange={(e) => setField("canonical_location", e.target.value)} placeholder="Bandra West" className="mt-1.5 w-full rounded-xl border border-[#cbd5df] bg-[#fbfcfb] px-3 py-2.5 text-sm outline-none focus:border-[#1687b8]" /></label>
              <label className="block text-sm font-medium">Regex pattern<input required maxLength={500} value={form.pattern} onChange={(e) => setField("pattern", e.target.value)} placeholder={String.raw`(?P<location>\bBandra(?:\s+West)?\b)`} className="mt-1.5 w-full rounded-xl border border-[#cbd5df] bg-[#fbfcfb] px-3 py-2.5 font-mono text-sm outline-none focus:border-[#1687b8]" /></label>
              <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end"><label className="block text-sm font-medium">Priority<input type="number" min={0} max={10000} value={form.priority} onChange={(e) => setField("priority", Number(e.target.value))} className="mt-1.5 w-full rounded-xl border border-[#cbd5df] bg-[#fbfcfb] px-3 py-2.5 text-sm" /></label><label className="flex items-center gap-2 pb-3 text-sm"><input type="checkbox" checked={form.is_active} onChange={(e) => setField("is_active", e.target.checked)} /> Active</label></div>
              <button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-[#14213d] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"><Save className="h-4 w-4" />{saving ? "Saving…" : editingId ? "Update rule" : "Add rule"}</button>
            </form>
          </section>

          <section className="rounded-2xl border border-[#d7e0e5] bg-[#14213d] p-5 text-white shadow-sm md:p-6"><div className="flex items-center gap-2"><FlaskConical className="h-5 w-5 text-[#5bd3f5]" /><h2 className="text-lg font-semibold">Test against a WhatsApp message</h2></div><p className="mt-2 text-sm leading-6 text-[#c8d6e5]">Test the current regex before saving. Matching uses case-insensitive search over the raw source message.</p><textarea value={sample} onChange={(e) => setSample(e.target.value)} placeholder="Paste a representative WhatsApp message…" className="mt-5 min-h-40 w-full rounded-xl border border-white/15 bg-white/10 p-3 text-sm text-white outline-none placeholder:text-[#9fb1c4] focus:border-[#5bd3f5]" /><button type="button" onClick={runTest} disabled={!form.pattern || !sample} className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[#21a7d8] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"><FlaskConical className="h-4 w-4" />Test regex</button>{testResult && <p className="mt-4 rounded-xl bg-white/10 px-3 py-2 text-sm text-[#dff8ff]">{testResult}</p>}<p className="mt-6 text-xs leading-5 text-[#9fb1c4]">Rules annotate new extractions. They never edit raw messages, invent inventory, or automatically change previously processed records.</p></section>
        </div>

        <section className="mt-6 rounded-2xl border border-[#d7e0e5] bg-white p-5 shadow-sm md:p-6"><div className="mb-4 flex items-center justify-between"><div><h2 className="text-lg font-semibold">Your rules</h2><p className="mt-1 text-xs text-[#718096]">Higher priority rules are evaluated first.</p></div><span className="rounded-full bg-[#e8f5f8] px-3 py-1 text-xs font-semibold text-[#1687b8]">{rules.length} rules</span></div>{loading ? <p className="py-8 text-center text-sm text-[#718096]">Loading rules…</p> : rules.length === 0 ? <div className="rounded-xl border border-dashed border-[#cbd5df] px-4 py-10 text-center text-sm text-[#718096]"><Plus className="mx-auto mb-2 h-5 w-5" />No rules yet. Add the location vocabulary your groups use.</div> : <div className="space-y-3">{rules.map((rule) => <div key={rule.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#e1e8ed] px-4 py-3"><div className="min-w-0"><div className="flex items-center gap-2 text-sm font-semibold"><MapPin className="h-4 w-4 text-[#1687b8]" />{rule.name}<span className={`rounded-full px-2 py-0.5 text-[10px] ${rule.is_active ? "bg-[#effaf5] text-[#166534]" : "bg-[#f1f3f5] text-[#718096]"}`}>{rule.is_active ? "Active" : "Paused"}</span></div><div className="mt-1 text-xs text-[#53657d]">{rule.canonical_location} · priority {rule.priority}</div><code className="mt-1 block truncate text-xs text-[#718096]">{rule.pattern}</code></div><div className="flex items-center gap-2"><button onClick={() => edit(rule)} className="rounded-lg border border-[#d7e0e5] p-2 text-[#53657d] hover:text-[#1687b8]" aria-label={`Edit ${rule.name}`}><Pencil className="h-4 w-4" /></button><button onClick={() => remove(rule)} className="rounded-lg border border-[#f0caca] p-2 text-[#a33a3a] hover:bg-[#fff4f4]" aria-label={`Delete ${rule.name}`}><Trash2 className="h-4 w-4" /></button></div></div>)}</div>}</section>
      </div>
    </main>
  );
}
