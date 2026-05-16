"""Lokale tolk-dienst.

WebSocket-protocol (alles lokaal, niets gaat naar het internet):

Client -> server
  - tekstframe  {"type": "start", "taalA": "nl", "taalB": "ar"}
  - binair frame  mono PCM 16-bit, 16 kHz
  - tekstframe  {"type": "stop"}

Server -> client
  - {"type": "status", "staat": "verbonden" | "luistert" | "gestopt"}
  - {"type": "ondertitel", "id", "spreker": "A"|"B", "bronTaal", "doelTaal",
     "tekst", "vertaling", "definitief"}

Milestone 3: spraakherkenning (faster-whisper) en vertaling (NLLB-200) draaien
beide lokaal. Er gaat tijdens een gesprek niets naar het internet.
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


def pcm_naar_float(data: bytes) -> np.ndarray:
    return np.frombuffer(data, dtype=np.int16).astype(np.float32) / 32768.0


async def behandel_verbinding(ws):
    talen = {"A": "nl", "B": "ar"}
    segmentator = Segmentator()
    segment_id = 0

    await ws.send(json.dumps({"type": "status", "staat": "verbonden"}))

    async def stuur_ondertitel(sid: int, audio: np.ndarray, definitief: bool):
        toegestaan = [talen["A"], talen["B"]]
        tekst, bron = await asyncio.to_thread(transcriptie.verwerk, audio, toegestaan)
        if not tekst:
            return
        spreker = "A" if bron == talen["A"] else "B"
        doel = talen["B"] if spreker == "A" else talen["A"]
        vertaling = await asyncio.to_thread(vertaler.vertaal, tekst, bron, doel)
        await ws.send(
            json.dumps(
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
        )

    async for bericht in ws:
        if isinstance(bericht, bytes):
            actie = segmentator.voeg_toe(pcm_naar_float(bericht))
            if actie == "interim":
                audio = segmentator.audio()
                if audio is not None:
                    await stuur_ondertitel(segment_id + 1, audio, False)
            elif actie == "definitief":
                segment_id += 1
                audio = segmentator.neem_segment()
                if audio is not None:
                    await stuur_ondertitel(segment_id, audio, True)
            continue

        data = json.loads(bericht)
        if data.get("type") == "start":
            talen["A"] = data.get("taalA", "nl")
            talen["B"] = data.get("taalB", "ar")
            segmentator = Segmentator()
            segment_id = 0
            await ws.send(json.dumps({"type": "status", "staat": "luistert"}))
        elif data.get("type") == "stop":
            await ws.send(json.dumps({"type": "status", "staat": "gestopt"}))


async def main():
    global transcriptie, vertaler
    print("Whisper-model laden...")
    transcriptie = Transcriptie()
    print("Vertaalmodel laden...")
    vertaler = Vertaling()
    print("Modellen geladen.")
    async with websockets.serve(behandel_verbinding, HOST, POORT, max_size=None):
        print(f"Tolk-dienst luistert op ws://{HOST}:{POORT}")
        await asyncio.Future()


if __name__ == "__main__":
    asyncio.run(main())
