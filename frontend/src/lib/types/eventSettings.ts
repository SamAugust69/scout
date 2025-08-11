export type EventSettings = {
    currentMatch: number
    tabletNumber: number | undefined
    exportAddress: string | undefined
}

export const eventSettingsDefault: EventSettings = {
    currentMatch: 0,
    tabletNumber: undefined,
    exportAddress: undefined,
}
