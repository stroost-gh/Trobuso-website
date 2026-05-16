"use client";

import { useCallback, useRef, useState } from "react";
import { TALEN, taalNaam, isRtl } from "../lib/talen";
import { OndertitelBericht, ServerBericht } from "../lib/protocol";
import { TolkVerbinding } from "../lib/tolkVerbinding";
import { AudioOpname } from "../lib/audio";

const WS_URL = process.env.NEXT_PUBLIC_TOLK_WS ?? "ws://127.0.0.1:8765";

type Fase = "instellen" | "actief";

function tekstVoor(o: OndertitelBericht, leesTaal: string): string {
  return o.bronTaal === leesTaal ? o.tekst : o.vertaling;
}

export default function TolkScherm() {
  const [fase, setFase] = useState<Fase>("instellen");
  const [taalA, setTaalA] = useState("nl");
  const [taalB, setTaalB] = useState("ar");
  const [verbonden, setVerbonden] = useState(false);
  const [ondertitels, setOndertitels] = useState<OndertitelBericht[]>([]);
  const [foutmelding, setFoutmelding] = useState<string | null>(null);

  const verbindingRef = useRef<TolkVerbinding | null>(null);
  const opnameRef = useRef<AudioOpname | null>(null);

  const opBericht = useCallback((bericht: ServerBericht) => {
    if (bericht.type === "ondertitel") {
      setOndertitels((huidig) => [...huidig, bericht].slice(-30));
    }
  }, []);

  async function ruimOp() {
    await opnameRef.current?.stop();
    verbindingRef.current?.sluit();
    opnameRef.current = null;
    verbindingRef.current = null;
  }

  async function start() {
    setFoutmelding(null);
    setOndertitels([]);
    try {
      const verbinding = new TolkVerbinding(WS_URL, opBericht, setVerbonden);
      await verbinding.verbind();
      verbinding.stuurBericht({ type: "start", taalA, taalB });
      verbindingRef.current = verbinding;

      const opname = new AudioOpname();
      await opname.start((pcm) => verbinding.stuurAudio(pcm));
      opnameRef.current = opname;

      setFase("actief");
    } catch {
      setFoutmelding(
        "Kon niet starten. Draait de lokale tolk-dienst en is de microfoon toegestaan?",
      );
      await ruimOp();
    }
  }

  async function stop() {
    verbindingRef.current?.stuurBericht({ type: "stop" });
    await ruimOp();
    setFase("instellen");
  }

  if (fase === "instellen") {
    return (
      <main className="instellen">
        <h1>Online Tolk</h1>
        <div className="taalkeuze">
          <div className="taalveld">
            <label htmlFor="taalA">Taal onderzijde</label>
            <select
              id="taalA"
              value={taalA}
              onChange={(e) => setTaalA(e.target.value)}
            >
              {TALEN.map((t) => (
                <option key={t.code} value={t.code}>
                  {t.naam}
                </option>
              ))}
            </select>
          </div>
          <div className="taalveld">
            <label htmlFor="taalB">Taal bovenzijde</label>
            <select
              id="taalB"
              value={taalB}
              onChange={(e) => setTaalB(e.target.value)}
            >
              {TALEN.map((t) => (
                <option key={t.code} value={t.code}>
                  {t.naam}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button className="knop" onClick={start} disabled={taalA === taalB}>
          Gesprek starten
        </button>
        {taalA === taalB && (
          <p className="melding">Kies twee verschillende talen.</p>
        )}
        {foutmelding && <p className="melding melding-fout">{foutmelding}</p>}
      </main>
    );
  }

  const recent = ondertitels.slice(-6);

  return (
    <div className="scherm">
      <Helft taal={taalB} ondertitels={recent} boven />
      <Helft
        taal={taalA}
        ondertitels={recent}
        verbonden={verbonden}
        opStop={stop}
      />
    </div>
  );
}

function Helft({
  taal,
  ondertitels,
  boven,
  verbonden,
  opStop,
}: {
  taal: string;
  ondertitels: OndertitelBericht[];
  boven?: boolean;
  verbonden?: boolean;
  opStop?: () => void;
}) {
  const rtl = isRtl(taal);
  return (
    <section className={boven ? "helft helft-boven" : "helft"}>
      <div className="helft-kop">
        <span>{taalNaam(taal)}</span>
        {opStop && (
          <span>
            <span style={{ marginRight: "1rem" }}>
              {verbonden ? "verbonden" : "niet verbonden"}
            </span>
            <button className="knop knop-stop knop-klein" onClick={opStop}>
              Stoppen
            </button>
          </span>
        )}
      </div>
      <div className="regels">
        {ondertitels.map((o) => (
          <p
            key={`${o.id}-${o.definitief}`}
            className={o.definitief ? "regel" : "regel regel-voorlopig"}
            dir={rtl ? "rtl" : "ltr"}
          >
            <span className="spreker">spreker {o.spreker}</span>
            {tekstVoor(o, taal)}
          </p>
        ))}
      </div>
    </section>
  );
}
