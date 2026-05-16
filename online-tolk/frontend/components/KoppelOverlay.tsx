"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { KOPPEL_INSTRUCTIE } from "../lib/koppelen";
import { isRtl } from "../lib/talen";

export function KoppelOverlay({
  taalA,
  taalB,
  opSluiten,
}: {
  taalA: string;
  taalB: string;
  opSluiten: () => void;
}) {
  const [qr, setQr] = useState("");
  const [url, setUrl] = useState("");
  const [lokaal, setLokaal] = useState(false);

  useEffect(() => {
    const host = window.location.hostname;
    setLokaal(host === "localhost" || host === "127.0.0.1");
    const adres = `${window.location.origin}/scherm`;
    setUrl(adres);
    QRCode.toDataURL(adres, { width: 320, margin: 1 })
      .then(setQr)
      .catch(() => setQr(""));
  }, []);

  return (
    <div className="overlay">
      <div className="overlay-paneel">
        <h2>Tweede scherm koppelen</h2>
        {qr && <img className="qr" src={qr} alt="QR-code" />}
        <p className="overlay-url">{url}</p>
        {lokaal && (
          <p className="melding melding-fout">
            Open de app via het netwerkadres van deze computer (niet localhost),
            anders kan het tweede scherm geen verbinding maken.
          </p>
        )}
        <div className="overlay-instructies">
          {[taalA, taalB].map((t) => (
            <p key={t} dir={isRtl(t) ? "rtl" : "ltr"}>
              {KOPPEL_INSTRUCTIE[t] ?? KOPPEL_INSTRUCTIE.en}
            </p>
          ))}
        </div>
        <button className="knop" onClick={opSluiten}>
          Sluiten
        </button>
      </div>
    </div>
  );
}
