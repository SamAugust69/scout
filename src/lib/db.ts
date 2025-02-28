import Dexie, { Table } from "dexie"
import { Event } from "./types/eventType"

export const db = new Dexie("DexieDatabase") as Dexie & {
    events: Table<Event, string>
}

// Version 1: Initial schema
db.version(1).stores({
    events: "id, name, week, year, event_code, logs, statistics",
})

// Version 2: Rename `logs` to `match_logs`
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

// Version 3: Add `schedule` field
db.version(3)
    .stores({
        events: "id, name, week, year, event_code, match_logs, statistics, schedule",
    })
    .upgrade((tx) => {
        return tx
            .table("events")
            .toCollection()
            .modify((event) => {
                event.schedule = []
            })
    })
