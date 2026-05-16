// Berichtenprotocol tussen frontend en de lokale tolk-dienst.
// De Python-kant (backend/server.py) spiegelt deze structuur.

export type Spreker = "A" | "B";

export interface StartBericht {
  type: "start";
  taalA: string;
  taalB: string;
}

export interface StopBericht {
  type: "stop";
}

export type ClientBericht = StartBericht | StopBericht;

export interface StatusBericht {
  type: "status";
  staat: "verbonden" | "luistert" | "gestopt";
}

export interface OndertitelBericht {
  type: "ondertitel";
  id: number;
  spreker: Spreker;
  bronTaal: string;
  doelTaal: string;
  tekst: string;
  vertaling: string;
  definitief: boolean;
}

export type ServerBericht = StatusBericht | OndertitelBericht;
