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

## Status

Milestone 3: de volledige pijplijn draait lokaal — microfoon, spraakherkenning
(faster-whisper), vertaling (NLLB-200) en het gesplitste ondertitelscherm.
