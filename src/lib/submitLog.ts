import { Log, logConfig } from "@/components/forms/formConfig"
import { Event, MatchLog } from "./types/eventType"
import { db } from "./db"

export const submitLog = async (eventData: Event, log: Log<keyof typeof logConfig>): Promise<Event> => {
    const newMatch: MatchLog = {
        matchNumber: log.match,
        logs: [log],
        statistics: { autoAverage: 0, teleopAverage: 0 },
    };

    // Find the match in eventData
    const matchInfo = eventData.match_logs.find(
        (match) => match.matchNumber === log.match
    );

    let updatedEventData: Event;

    if (!matchInfo) {
        console.log("No match data found, creating new match");
        updatedEventData = {
            ...eventData,
            match_logs: [...eventData.match_logs, newMatch],
        };
    } else {
        console.log("Match data found, updating existing match");
        const updatedMatchInfo = {
            ...matchInfo,
            logs: [...matchInfo.logs, log],
        };

        updatedEventData = {
            ...eventData,
            match_logs: [
                ...eventData.match_logs.filter(
                    (match) => match.matchNumber !== log.match
                ),
                updatedMatchInfo,
            ],
        };
    }

    // Update the database
    try {
        await db.events.update(updatedEventData, {
            ...updatedEventData,
            match_logs: updatedEventData.match_logs,
        });
        console.log("Database update successful for log:", log);
    } catch (error) {
        console.error("Database update failed for log:", log, error);
    }

    // Return the updated eventData
    return updatedEventData;
};