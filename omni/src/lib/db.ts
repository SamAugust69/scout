import Dexie from "dexie";

interface DexieDatabase extends Dexie {
  events: {
    id: string;
    name: string;
    week: number;
    year: number;
    event_code: string;
    logs: any;
    statistics: any;
  };
}

export const db = new Dexie("DexieDatabase") as DexieDatabase;

db.version(1).stores({
  events: "id, name, week, year, event_code, logs, statistics",
});
