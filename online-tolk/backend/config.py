HOST = "127.0.0.1"
POORT = 8765

# Audio dat de frontend stuurt: mono PCM 16-bit op 16 kHz.
SAMPLE_RATE = 16000

# Whisper-model (lokaal). Grotere modellen = nauwkeuriger maar trager.
# tiny / base / small / medium / large-v3
WHISPER_MODEL = "small"
# "int8" werkt overal (ook zonder GPU); op een GPU is "float16" sneller.
WHISPER_COMPUTE = "int8"
# "auto" kiest GPU indien beschikbaar, anders CPU.
WHISPER_DEVICE = "auto"

# Segmentatie / stiltedetectie
SPRAAK_RMS_DREMPEL = 0.012      # energie waarboven een blok als spraak telt
STILTE_DREMPEL_SEC = 1.5        # zoveel aaneengesloten stilte beeindigt een segment
INTERIM_INTERVAL_SEC = 1.2      # hoe vaak voorlopige (grijze) tekst getoond wordt
MAX_SEGMENT_SEC = 28            # harde bovengrens; Whisper werkt met vensters van 30 s
