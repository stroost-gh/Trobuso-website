"""Lokale tolk-dienst.

WebSocket-protocol (alles lokaal/LAN, niets gaat naar het internet):

Client -> server
  - tekstframe  {"type": "start", "taalA": "nl", "taalB": "ar"}
  - binair frame  mono PCM 16-bit, 16 kHz
  - tekstframe  {"type": "stop"}
  - tekstframe  {"type": "koppel", "code": "123456"}   (tweede scherm)

Server -> client
  - {"type": "status", "staat": "verbonden"}
  - {"type": "koppelcode", "code": "123456"}   (alleen naar het hoofdscherm)
  - {"type": "koppel_ok"} / {"type": "koppel_fout"}
  - {"type": "sessie", "taalA", "taalB", "actief"}
  - {"type": "ondertitel", "id", "spreker", "bronTaal", "doelTaal",
     "tekst", "vertaling", "definitief"}

Een gesprek is een enkele gedeelde sessie. Het hoofdscherm stuurt audio en
krijgt een koppelcode; extra schermen (bv. een tablet) moeten die code opgeven
voordat ze ondertitels ontvangen. Bij elk nieuw gesprek geldt een nieuwe code.
"""

import asyncio
import json
import random

import numpy as np
import websockets

from config import HOST, POORT
from segmentatie import Segmentator
from transcriptie import Transcriptie
from vertaling import Vertaling

transcriptie: Transcriptie | None = None
vertaler: Vertaling | None = None

verbindingen: set = set()
gemachtigd: set = set()
sessie = {
    "taalA": "nl",
    "taalB": "ar",
    "actief": False,
    "segment_id": 0,
    "koppelcode": "",
}


def pcm_naar_float(data: bytes) -> np.ndarray:
    return np.frombuffer(data, dtype=np.int16).astype(np.float32) / 32768.0


def sessie_bericht() -> dict:
    return {
        "type": "sessie",
        "taalA": sessie["taalA"],
        "taalB": sessie["taalB"],
        "actief": sessie["actief"],
    }


async def stuur(ws, bericht: dict):
    try:
        await ws.send(json.dumps(bericht))
    except Exception:
        verbindingen.discard(ws)
        gemachtigd.discard(ws)


async def broadcast(bericht: dict):
    for ws in list(gemachtigd):
        await stuur(ws, bericht)


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
    await stuur(ws, {"type": "status", "staat": "verbonden"})
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
            soort = data.get("type")

            if soort == "start":
                # Nieuw gesprek: oude tweede schermen moeten opnieuw koppelen.
                for oud in list(gemachtigd):
                    if oud is not ws:
                        await stuur(oud, {"type": "koppel_fout"})
                sessie["taalA"] = data.get("taalA", "nl")
                sessie["taalB"] = data.get("taalB", "ar")
                sessie["actief"] = True
                sessie["segment_id"] = 0
                sessie["koppelcode"] = f"{random.randint(0, 999999):06d}"
                segmentator = Segmentator()
                gemachtigd.clear()
                gemachtigd.add(ws)
                await stuur(ws, {"type": "koppelcode", "code": sessie["koppelcode"]})
                await stuur(ws, sessie_bericht())
            elif soort == "stop":
                sessie["actief"] = False
                await broadcast(sessie_bericht())
            elif soort == "koppel":
                if sessie["actief"] and data.get("code") == sessie["koppelcode"]:
                    gemachtigd.add(ws)
                    await stuur(ws, {"type": "koppel_ok"})
                    await stuur(ws, sessie_bericht())
                else:
                    await stuur(ws, {"type": "koppel_fout"})
    finally:
        verbindingen.discard(ws)
        gemachtigd.discard(ws)


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
