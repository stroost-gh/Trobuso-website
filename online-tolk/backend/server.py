"""Lokale tolk-dienst.

WebSocket-protocol (alles lokaal/LAN, niets gaat naar het internet):

Client -> server
  - tekstframe  {"type": "start", "taalA": "nl", "taalB": "ar"}
  - binair frame  mono PCM 16-bit, 16 kHz
  - tekstframe  {"type": "stop"}

Server -> client (naar alle verbonden schermen)
  - {"type": "status", "staat": "verbonden"}
  - {"type": "sessie", "taalA", "taalB", "actief"}
  - {"type": "ondertitel", "id", "spreker": "A"|"B", "bronTaal", "doelTaal",
     "tekst", "vertaling", "definitief"}

Een gesprek is een enkele gedeelde sessie. Het hoofdscherm stuurt audio; extra
schermen (bv. een tablet) verbinden alleen mee en ontvangen dezelfde ondertitels.
"""

import asyncio
import json

import numpy as np
import websockets

from config import HOST, POORT
from segmentatie import Segmentator
from transcriptie import Transcriptie
from vertaling import Vertaling

transcriptie: Transcriptie | None = None
vertaler: Vertaling | None = None

verbindingen: set = set()
sessie = {"taalA": "nl", "taalB": "ar", "actief": False, "segment_id": 0}


def pcm_naar_float(data: bytes) -> np.ndarray:
    return np.frombuffer(data, dtype=np.int16).astype(np.float32) / 32768.0


def sessie_bericht() -> dict:
    return {
        "type": "sessie",
        "taalA": sessie["taalA"],
        "taalB": sessie["taalB"],
        "actief": sessie["actief"],
    }


async def broadcast(bericht: dict):
    data = json.dumps(bericht)
    for ws in list(verbindingen):
        try:
            await ws.send(data)
        except Exception:
            verbindingen.discard(ws)


async def stuur_ondertitel(sid: int, audio: np.ndarray, definitief: bool):
    toegestaan = [sessie["taalA"], sessie["taalB"]]
    tekst, bron = await asyncio.to_thread(transcriptie.verwerk, audio, toegestaan)
    if not tekst:
        return
    spreker = "A" if bron == sessie["taalA"] else "B"
    doel = sessie["taalB"] if spreker == "A" else sessie["taalA"]
    vertaling = await asyncio.to_thread(vertaler.vertaal, tekst, bron, doel)
    await broadcast(
        {
            "type": "ondertitel",
            "id": sid,
            "spreker": spreker,
            "bronTaal": bron,
            "doelTaal": doel,
            "tekst": tekst,
            "vertaling": vertaling,
            "definitief": definitief,
        }
    )


async def behandel_verbinding(ws):
    verbindingen.add(ws)
    segmentator = Segmentator()
    await ws.send(json.dumps({"type": "status", "staat": "verbonden"}))
    await ws.send(json.dumps(sessie_bericht()))
    try:
        async for bericht in ws:
            if isinstance(bericht, bytes):
                if not sessie["actief"]:
                    continue
                actie = segmentator.voeg_toe(pcm_naar_float(bericht))
                if actie == "interim":
                    audio = segmentator.audio()
                    if audio is not None:
                        await stuur_ondertitel(sessie["segment_id"] + 1, audio, False)
                elif actie == "definitief":
                    sessie["segment_id"] += 1
                    audio = segmentator.neem_segment()
                    if audio is not None:
                        await stuur_ondertitel(sessie["segment_id"], audio, True)
                continue

            data = json.loads(bericht)
            if data.get("type") == "start":
                sessie["taalA"] = data.get("taalA", "nl")
                sessie["taalB"] = data.get("taalB", "ar")
                sessie["actief"] = True
                sessie["segment_id"] = 0
                segmentator = Segmentator()
                await broadcast(sessie_bericht())
            elif data.get("type") == "stop":
                sessie["actief"] = False
                await broadcast(sessie_bericht())
    finally:
        verbindingen.discard(ws)


async def main():
    global transcriptie, vertaler
    print("Whisper-model laden...")
    transcriptie = Transcriptie()
    print("Vertaalmodel laden...")
    vertaler = Vertaling()
    print("Modellen geladen.")
    async with websockets.serve(behandel_verbinding, HOST, POORT, max_size=None):
        print(f"Tolk-dienst luistert op poort {POORT}")
        await asyncio.Future()


if __name__ == "__main__":
    asyncio.run(main())
