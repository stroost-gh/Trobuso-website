"use client";

import { useEffect, useRef, useState } from "react";
import { OndertitelBericht, ServerBericht } from "../lib/protocol";
import { TolkVerbinding } from "../lib/tolkVerbinding";
import { wsUrl } from "../lib/config";
import { Helft } from "./Helft";

// Tweede scherm: kijkt alleen mee, stuurt geen audio. Het verbindt met de
// lokale tolk-dienst en toont dezelfde ondertitels als het hoofdscherm.
export default function KijkScherm() {
  const [taalA, setTaalA] = useState<string | null>(null);
  const [taalB, setTaalB] = useState<string | null>(null);
  const [actief, setActief] = useState(false);
  const [verbonden, setVerbonden] = useState(false);
  const [ondertitels, setOndertitels] = useState<OndertitelBericht[]>([]);

  const verbindingRef = useRef<TolkVerbinding | null>(null);

  useEffect(() => {
    function opBericht(bericht: ServerBericht) {
      if (bericht.type === "sessie") {
        setTaalA(bericht.taalA);
        setTaalB(bericht.taalB);
        setActief(bericht.actief);
        if (bericht.actief) setOndertitels([]);
      } else if (bericht.type === "ondertitel") {
        setOndertitels((huidig) => {
          const zonder = huidig.filter((o) => o.id !== bericht.id);
          return [...zonder, bericht].slice(-30);
        });
      }
    }

    const verbinding = new TolkVerbinding(wsUrl(), opBericht, setVerbonden);
    verbindingRef.current = verbinding;
    verbinding.verbind().catch(() => {});

    return () => verbinding.sluit();
  }, []);

  if (!taalA || !taalB || !actief) {
    return (
      <main className="instellen">
        <h1>Tweede scherm</h1>
        <p className="melding">
          {verbonden
            ? "Verbonden — wachten op het gesprek..."
            : "Verbinding maken met het hoofdscherm..."}
        </p>
      </main>
    );
  }

  const recent = ondertitels.slice(-6);

  return (
    <div className="scherm">
      <Helft taal={taalB} ondertitels={recent} boven />
      <Helft taal={taalA} ondertitels={recent} />
    </div>
  );
}
