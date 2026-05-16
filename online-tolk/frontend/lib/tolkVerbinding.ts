import { ClientBericht, ServerBericht } from "./protocol";

export class TolkVerbinding {
  private ws: WebSocket | null = null;

  constructor(
    private url: string,
    private opBericht: (bericht: ServerBericht) => void,
    private opVerbindingsstatus: (verbonden: boolean) => void,
  ) {}

  verbind(): Promise<void> {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(this.url);
      ws.binaryType = "arraybuffer";
      ws.onopen = () => {
        this.opVerbindingsstatus(true);
        resolve();
      };
      ws.onerror = () => reject(new Error("WebSocket-verbinding mislukt"));
      ws.onclose = () => this.opVerbindingsstatus(false);
      ws.onmessage = (e) => {
        if (typeof e.data === "string") {
          this.opBericht(JSON.parse(e.data) as ServerBericht);
        }
      };
      this.ws = ws;
    });
  }

  stuurBericht(bericht: ClientBericht) {
    this.ws?.send(JSON.stringify(bericht));
  }

  stuurAudio(buffer: ArrayBuffer) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(buffer);
    }
  }

  sluit() {
    this.ws?.close();
    this.ws = null;
  }
}
