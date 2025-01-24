// This is our common file, this shouldn't be modified.
// make a new log{year}.ts file, and create a schema.

// Types that all logs should contain, no matter the year

export type EventCommon = {
    id: string
    name: string
    week: number
    year: number
    event_code: number
    schedule: Array<any>
}
