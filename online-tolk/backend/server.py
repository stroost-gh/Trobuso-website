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

In deze skeleton-versie zijn spraakherkenning en vertaling nog stubs. Milestone 2
voegt lokale spraakherkenning (Whisper) toe, milestone 3 lokale vertaling (NLLB).
"""

import asyncio
import json

import websockets

from config import HOST, POORT, SAMPLE_RATE

# Hoeveel audio (in bytes) we ontvangen voordat de stub een ondertitel teruggeeft.
# 2 seconden mono PCM16 op 16 kHz = SAMPLE_RATE * 2 bytes/sample * 2 sec.
STUB_DREMPEL = SAMPLE_RATE * 2 * 2


async def behandel_verbinding(ws):
    talen = {"A": "nl", "B": "ar"}
    audio_bytes = 0
    teller = 0

    await ws.send(json.dumps({"type": "status", "staat": "verbonden"}))

    async for bericht in ws:
        if isinstance(bericht, bytes):
            audio_bytes += len(bericht)
            if audio_bytes >= STUB_DREMPEL:
                audio_bytes = 0
                teller += 1
                spreker = "A" if teller % 2 else "B"
                bron = talen[spreker]
                doel = talen["B"] if spreker == "A" else talen["A"]
                await ws.send(
                    json.dumps(
                        {
                            "type": "ondertitel",
                            "id": teller,
                            "spreker": spreker,
                            "bronTaal": bron,
                            "doelTaal": doel,
                            "tekst": f"[stub] herkende spraak {teller}",
                            "vertaling": f"[stub] vertaling {teller}",
                            "definitief": True,
                        }
                    )
                )
            continue

        data = json.loads(bericht)
        if data.get("type") == "start":
            talen["A"] = data.get("taalA", "nl")
            talen["B"] = data.get("taalB", "ar")
            audio_bytes = 0
            teller = 0
            await ws.send(json.dumps({"type": "status", "staat": "luistert"}))
        elif data.get("type") == "stop":
            await ws.send(json.dumps({"type": "status", "staat": "gestopt"}))


async def main():
    async with websockets.serve(behandel_verbinding, HOST, POORT, max_size=None):
        print(f"Tolk-dienst luistert op ws://{HOST}:{POORT}")
        await asyncio.Future()


if __name__ == "__main__":
    asyncio.run(main())
