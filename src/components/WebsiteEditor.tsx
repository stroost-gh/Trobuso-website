"use client";

import { useState } from "react";

/* ── Types ───────────────────────────────────── */

interface Props {
  initialData: Record<string, any>;
}

interface SectieConfig {
  label: string;
  velden: VeldConfig[];
}

interface VeldConfig {
  key: string;
  label: string;
  type: "text" | "textarea" | "array" | "objectArray";
  subVelden?: { key: string; label: string; type: "text" | "textarea" }[];
}

/* ── Sectie-definitie ────────────────────────── */

const SECTIE_CONFIG: Record<string, SectieConfig> = {
  hero: {
    label: "Hero",
    velden: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "titel_voor_accent", label: "Titel (voor accent)", type: "text" },
      { key: "titel_accent", label: "Titel (accent woord)", type: "text" },
      { key: "titel_na_accent", label: "Titel (na accent)", type: "text" },
      { key: "titel_italic", label: "Titel (italic)", type: "text" },
      { key: "beschrijving", label: "Beschrijving", type: "textarea" },
      { key: "cta_primair", label: "CTA primair", type: "text" },
      { key: "cta_secundair", label: "CTA secundair", type: "text" },
      { key: "marquee", label: "Marquee woorden", type: "array" },
    ],
  },
  intro: {
    label: "Intro",
    velden: [
      { key: "titel_voor_accent", label: "Titel (voor accent)", type: "text" },
      { key: "titel_accent", label: "Titel (accent woord)", type: "text" },
      { key: "titel_na_accent", label: "Titel (na accent)", type: "text" },
      { key: "titel_italic", label: "Titel (italic)", type: "text" },
      { key: "alinea_1", label: "Alinea 1", type: "textarea" },
      { key: "alinea_2", label: "Alinea 2", type: "textarea" },
    ],
  },
  diensten: {
    label: "Diensten",
    velden: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "titel", label: "Titel", type: "text" },
      { key: "titel_italic", label: "Titel (italic)", type: "text" },
      {
        key: "items",
        label: "Diensten",
        type: "objectArray",
        subVelden: [
          { key: "nummer", label: "Nummer", type: "text" },
          { key: "titel", label: "Titel", type: "text" },
          { key: "beschrijving", label: "Beschrijving", type: "textarea" },
        ],
      },
    ],
  },
  aanpak: {
    label: "Aanpak",
    velden: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "titel", label: "Titel", type: "text" },
      { key: "titel_italic", label: "Titel (italic)", type: "text" },
      {
        key: "stappen",
        label: "Stappen",
        type: "objectArray",
        subVelden: [
          { key: "nummer", label: "Nummer", type: "text" },
          { key: "titel", label: "Titel", type: "text" },
          { key: "beschrijving", label: "Beschrijving", type: "textarea" },
        ],
      },
    ],
  },
  over: {
    label: "Over ons",
    velden: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "titel", label: "Titel", type: "text" },
      { key: "titel_italic", label: "Titel (italic)", type: "text" },
      { key: "alinea_1", label: "Alinea 1", type: "textarea" },
      { key: "alinea_2", label: "Alinea 2", type: "textarea" },
      {
        key: "stats",
        label: "Statistieken",
        type: "objectArray",
        subVelden: [
          { key: "waarde", label: "Waarde", type: "text" },
          { key: "label", label: "Label", type: "text" },
        ],
      },
    ],
  },
  cases: {
    label: "Cases",
    velden: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "titel", label: "Titel", type: "text" },
      { key: "titel_italic", label: "Titel (italic)", type: "text" },
      {
        key: "items",
        label: "Cases",
        type: "objectArray",
        subVelden: [
          { key: "tag", label: "Tag (branche · klant · periode)", type: "text" },
          { key: "titel", label: "Titel", type: "text" },
          { key: "beschrijving", label: "Beschrijving", type: "textarea" },
        ],
      },
    ],
  },
  specialisaties: {
    label: "Specialisaties",
    velden: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "titel", label: "Titel", type: "text" },
      { key: "titel_italic", label: "Titel (italic)", type: "text" },
      {
        key: "items",
        label: "Specialisaties",
        type: "objectArray",
        subVelden: [
          { key: "titel", label: "Titel", type: "text" },
          { key: "beschrijving", label: "Beschrijving", type: "textarea" },
        ],
      },
    ],
  },
  contact: {
    label: "Contact",
    velden: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "titel", label: "Titel", type: "text" },
      { key: "titel_italic", label: "Titel (italic)", type: "text" },
      { key: "beschrijving", label: "Beschrijving", type: "textarea" },
      { key: "email", label: "E-mail", type: "text" },
      { key: "telefoon", label: "Telefoon", type: "text" },
      { key: "telefoon_link", label: "Telefoon link (internationaal)", type: "text" },
      { key: "adres_regel_1", label: "Adres regel 1", type: "text" },
      { key: "adres_regel_2", label: "Adres regel 2", type: "text" },
      { key: "cta", label: "CTA tekst", type: "text" },
    ],
  },
  footer: {
    label: "Footer",
    velden: [
      { key: "beschrijving", label: "Beschrijving", type: "textarea" },
      { key: "kvk", label: "KvK", type: "text" },
      { key: "iban", label: "IBAN", type: "text" },
      { key: "adres_regel_1", label: "Adres regel 1", type: "text" },
      { key: "adres_regel_2", label: "Adres regel 2", type: "text" },
      { key: "email", label: "E-mail", type: "text" },
      { key: "telefoon", label: "Telefoon", type: "text" },
    ],
  },
  klanten: {
    label: "Klanten (logo's)",
    velden: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      {
        key: "items",
        label: "Klanten",
        type: "objectArray",
        subVelden: [
          { key: "naam", label: "Naam", type: "text" },
          { key: "logo", label: "Logo pad", type: "text" },
        ],
      },
    ],
  },
};

const SECTIE_VOLGORDE = [
  "hero", "klanten", "intro", "diensten", "aanpak",
  "over", "cases", "specialisaties", "contact", "footer",
];

/* ── Component ───────────────────────────────── */

export function WebsiteEditor({ initialData }: Props) {
  const [data, setData] = useState<Record<string, any>>(initialData);
  const [openSectie, setOpenSectie] = useState<string | null>("hero");
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  function updateVeld(sectie: string, key: string, value: any) {
    setData((prev) => ({
      ...prev,
      [sectie]: { ...prev[sectie], [key]: value },
    }));
  }

  function updateArrayItem(sectie: string, key: string, index: number, value: string) {
    setData((prev) => {
      const arr = [...(prev[sectie]?.[key] ?? [])];
      arr[index] = value;
      return { ...prev, [sectie]: { ...prev[sectie], [key]: arr } };
    });
  }

  function addArrayItem(sectie: string, key: string) {
    setData((prev) => {
      const arr = [...(prev[sectie]?.[key] ?? []), ""];
      return { ...prev, [sectie]: { ...prev[sectie], [key]: arr } };
    });
  }

  function removeArrayItem(sectie: string, key: string, index: number) {
    setData((prev) => {
      const arr = [...(prev[sectie]?.[key] ?? [])];
      arr.splice(index, 1);
      return { ...prev, [sectie]: { ...prev[sectie], [key]: arr } };
    });
  }

  function updateObjectArrayItem(sectie: string, key: string, index: number, subKey: string, value: any) {
    setData((prev) => {
      const arr = [...(prev[sectie]?.[key] ?? [])];
      arr[index] = { ...arr[index], [subKey]: value };
      return { ...prev, [sectie]: { ...prev[sectie], [key]: arr } };
    });
  }

  function addObjectArrayItem(sectie: string, key: string, subVelden: { key: string }[]) {
    setData((prev) => {
      const template: Record<string, string> = {};
      for (const sv of subVelden) template[sv.key] = "";
      const arr = [...(prev[sectie]?.[key] ?? []), template];
      return { ...prev, [sectie]: { ...prev[sectie], [key]: arr } };
    });
  }

  function removeObjectArrayItem(sectie: string, key: string, index: number) {
    setData((prev) => {
      const arr = [...(prev[sectie]?.[key] ?? [])];
      arr.splice(index, 1);
      return { ...prev, [sectie]: { ...prev[sectie], [key]: arr } };
    });
  }

  async function opslaan(sectie: string) {
    setSaving(sectie);
    try {
      const res = await fetch("/api/website-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectie, inhoud: data[sectie] }),
      });
      if (res.ok) {
        setSaved(sectie);
        setTimeout(() => setSaved(null), 3000);
      }
    } finally {
      setSaving(null);
    }
  }

  const inputCls = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-trobuso-900 focus:border-transparent";

  return (
    <div className="space-y-3">
      {SECTIE_VOLGORDE.map((sectieKey) => {
        const config = SECTIE_CONFIG[sectieKey];
        if (!config || !data[sectieKey]) return null;
        const isOpen = openSectie === sectieKey;
        const sd = data[sectieKey];

        return (
          <div key={sectieKey} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => setOpenSectie(isOpen ? null : sectieKey)}
              className="w-full flex items-center gap-3 px-6 py-4 text-left hover:bg-gray-50 transition-colors"
            >
              <svg className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-90" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="font-semibold text-gray-900 flex-1">{config.label}</span>
              {saved === sectieKey && (
                <span className="text-xs text-green-600 font-medium">Opgeslagen!</span>
              )}
            </button>

            {isOpen && (
              <div className="px-6 pb-6 space-y-4 border-t border-gray-100 pt-4">
                {config.velden.map((veld) => (
                  <div key={veld.key}>
                    {veld.type === "text" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">{veld.label}</label>
                        <input type="text" value={sd[veld.key] ?? ""} onChange={(e) => updateVeld(sectieKey, veld.key, e.target.value)} className={inputCls} />
                      </div>
                    )}

                    {veld.type === "textarea" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">{veld.label}</label>
                        <textarea value={sd[veld.key] ?? ""} onChange={(e) => updateVeld(sectieKey, veld.key, e.target.value)} rows={3} className={inputCls + " resize-y"} />
                      </div>
                    )}

                    {veld.type === "array" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">{veld.label}</label>
                        <div className="space-y-2">
                          {(sd[veld.key] as string[] ?? []).map((item: string, i: number) => (
                            <div key={i} className="flex gap-2">
                              <input type="text" value={item} onChange={(e) => updateArrayItem(sectieKey, veld.key, i, e.target.value)} className={inputCls} />
                              <button onClick={() => removeArrayItem(sectieKey, veld.key, i)} className="px-2 text-gray-400 hover:text-red-500 text-lg">×</button>
                            </div>
                          ))}
                          <button onClick={() => addArrayItem(sectieKey, veld.key)} className="text-xs text-trobuso-900 hover:text-trobuso-700 font-medium">+ Toevoegen</button>
                        </div>
                      </div>
                    )}

                    {veld.type === "objectArray" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{veld.label}</label>
                        <div className="space-y-3">
                          {(sd[veld.key] as any[] ?? []).map((item: any, i: number) => (
                            <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-gray-500">#{i + 1}</span>
                                <button onClick={() => removeObjectArrayItem(sectieKey, veld.key, i)} className="text-gray-400 hover:text-red-500 text-lg">×</button>
                              </div>
                              {veld.subVelden?.map((sv) => (
                                <div key={sv.key}>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">{sv.label}</label>
                                  {sv.type === "textarea" ? (
                                    <textarea value={item[sv.key] ?? ""} onChange={(e) => updateObjectArrayItem(sectieKey, veld.key, i, sv.key, e.target.value)} rows={3} className={inputCls + " resize-y bg-white"} />
                                  ) : (
                                    <input type="text" value={item[sv.key] ?? ""} onChange={(e) => updateObjectArrayItem(sectieKey, veld.key, i, sv.key, e.target.value)} className={inputCls + " bg-white"} />
                                  )}
                                </div>
                              ))}
                              {item.bullets && (
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">Bulletpoints</label>
                                  <div className="space-y-1.5">
                                    {(item.bullets as string[]).map((b: string, bi: number) => (
                                      <div key={bi} className="flex gap-2">
                                        <input type="text" value={b} onChange={(e) => { const nb = [...item.bullets]; nb[bi] = e.target.value; updateObjectArrayItem(sectieKey, veld.key, i, "bullets", nb); }} className={inputCls + " bg-white"} />
                                        <button onClick={() => { const nb = [...item.bullets]; nb.splice(bi, 1); updateObjectArrayItem(sectieKey, veld.key, i, "bullets", nb); }} className="px-1 text-gray-400 hover:text-red-500">×</button>
                                      </div>
                                    ))}
                                    <button onClick={() => updateObjectArrayItem(sectieKey, veld.key, i, "bullets", [...(item.bullets ?? []), ""])} className="text-xs text-trobuso-900 hover:text-trobuso-700 font-medium">+ Bullet</button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                          <button onClick={() => addObjectArrayItem(sectieKey, veld.key, veld.subVelden ?? [])} className="text-xs text-trobuso-900 hover:text-trobuso-700 font-medium">+ Toevoegen</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                <div className="pt-2">
                  <button
                    onClick={() => opslaan(sectieKey)}
                    disabled={saving === sectieKey}
                    className="bg-trobuso-900 hover:bg-trobuso-800 text-white font-semibold px-5 py-2 rounded-lg text-sm transition-colors disabled:opacity-60"
                  >
                    {saving === sectieKey ? "Opslaan..." : saved === sectieKey ? "Opgeslagen!" : "Opslaan"}
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
