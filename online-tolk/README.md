# Online Tolk

Lokale, realtime tolk voor gesprekken tussen twee personen die elkaars taal niet
spreken — bedoeld voor o.a. een spreekuur tussen een bedrijfsarts en een
werknemer. Alle audio- en tekstverwerking gebeurt **lokaal op het apparaat**;
er gaat niets naar het internet.

## Opzet

- `frontend/` — Next.js-app: gesplitst scherm met live ondertitels, taalkeuze,
  microfoon-opname. Draait op `localhost`.
- `backend/` — Python-dienst: WebSocket-server die audio ontvangt en ondertitels
  terugstuurt. In deze skeleton-versie zijn spraakherkenning en vertaling nog
  stubs; de lokale modellen (Whisper, NLLB) volgen in latere milestones.

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

Milestone 1 — skeleton: frontend en backend praten via een lokale WebSocket;
de vertaalpijplijn is nog een stub.
