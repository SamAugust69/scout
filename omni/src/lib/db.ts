import Dexie, { EntityTable } from "dexie"
import { Event } from "./types/eventType"

export const db = new Dexie("DexieDatabase") as Dexie & {
    events: EntityTable<Event>
}

db.version(1).stores({
    events: "id, name, week, year, event_code, logs, statistics",
})

db.version(2)
    .stores({
        events: "id, name, week, year, event_code, match_logs, statistics",
    })
    .upgrade((tx) => {
        return tx
            .table("events")
            .toCollection()
            .modify((event) => {
                event.match_logs = event.logs
                delete event.logs
            })
    })
