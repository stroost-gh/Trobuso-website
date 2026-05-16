// Microfoon-opname: levert mono PCM 16-bit op 16 kHz aan, in chunks van ~100 ms.

const SAMPLE_RATE = 16000;

export class AudioOpname {
  private context: AudioContext | null = null;
  private stream: MediaStream | null = null;
  private node: AudioWorkletNode | null = null;

  async start(opChunk: (pcm: ArrayBuffer) => void) {
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true,
      },
    });

    this.context = new AudioContext({ sampleRate: SAMPLE_RATE });
    await this.context.audioWorklet.addModule("/pcm-worklet.js");

    const bron = this.context.createMediaStreamSource(this.stream);
    this.node = new AudioWorkletNode(this.context, "pcm-worklet");
    this.node.port.onmessage = (e) => {
      opChunk(floatNaarPcm16(e.data as Float32Array));
    };
    bron.connect(this.node);
  }

  async stop() {
    this.node?.disconnect();
    this.node = null;
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;
    await this.context?.close();
    this.context = null;
  }
}

function floatNaarPcm16(samples: Float32Array): ArrayBuffer {
  const pcm = new Int16Array(samples.length);
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    pcm[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return pcm.buffer;
}
