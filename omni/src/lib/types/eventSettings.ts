export type EventSettings = {
    currentMatch: number
    tabletNumber: number | undefined
}

export const eventSettingsDefault: EventSettings = {
    currentMatch: 0,
    tabletNumber: undefined,
}
