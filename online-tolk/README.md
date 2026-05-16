# Online Tolk

Lokale, realtime tolk voor gesprekken tussen twee personen die elkaars taal niet
spreken — bedoeld voor o.a. een spreekuur tussen een bedrijfsarts en een
werknemer. Alle audio- en tekstverwerking gebeurt **lokaal op het apparaat**;
er gaat niets naar het internet.

## Opzet

- `frontend/` — Next.js-app: gesplitst scherm met live ondertitels, taalkeuze,
  microfoon-opname. Draait op `localhost`.
- `backend/` — Python-dienst: WebSocket-server die audio ontvangt en ondertitels
  terugstuurt. Spraakherkenning (faster-whisper) en vertaling (NLLB-200) draaien
  lokaal; de modellen worden eenmalig gedownload en daarna gecachet.

## Ondersteunde talen

Nederlands, Engels, Duits, Pools, Arabisch, Frans, Spaans, Portugees,
Italiaans, Oekraïens.

## Lokaal draaien

Backend:

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python server.py
```

Frontend (in een tweede terminal):

```bash
cd frontend
npm install
npm run dev
```

Open daarna http://localhost:3000.

## Tweede scherm

Een tablet of telefoon op hetzelfde lokale netwerk kan als tweede (meekijkend)
scherm dienen via de route `/scherm`. Open de app op het hoofdscherm dan wél via
het netwerkadres van de computer (bv. `http://192.168.1.5:3000`) in plaats van
`localhost`; de knop "Tweede scherm" toont dan een QR-code en koppelinstructies
in de twee gekozen gesprekstalen.

## Status

Milestone 5: de volledige pijplijn draait lokaal — microfoon, spraakherkenning
(faster-whisper), vertaling (NLLB-200) en het gesplitste ondertitelscherm. Na
afloop toont de app een transcript dat alleen op verzoek lokaal als tekstbestand
te downloaden is. Een tweede scherm kan meekijken; de verbinding herstelt zich
automatisch na een netwerkonderbreking.
