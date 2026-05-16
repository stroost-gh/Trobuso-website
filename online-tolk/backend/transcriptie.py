"""Lokale spraakherkenning met faster-whisper.

Het model wordt eenmalig (bij de eerste keer) van Hugging Face gedownload en
daarna lokaal gecachet; tijdens een gesprek gaat er niets naar het internet.
"""

import numpy as np
from faster_whisper import WhisperModel

from config import WHISPER_COMPUTE, WHISPER_DEVICE, WHISPER_MODEL


class Transcriptie:
    def __init__(self):
        self.model = WhisperModel(
            WHISPER_MODEL, device=WHISPER_DEVICE, compute_type=WHISPER_COMPUTE
        )

    def verwerk(self, audio: np.ndarray, toegestane_talen: list[str]):
        """Transcribeer een audiosegment. Geeft (tekst, taalcode) terug.

        De taal wordt automatisch herkend; valt die buiten de twee gekozen
        talen, dan wordt teruggevallen op de eerste gekozen taal.
        """
        segments, info = self.model.transcribe(
            audio,
            beam_size=1,
            language=None,
            vad_filter=False,
        )
        tekst = " ".join(s.text.strip() for s in segments).strip()
        taal = info.language if info.language in toegestane_talen else toegestane_talen[0]
        return tekst, taal
