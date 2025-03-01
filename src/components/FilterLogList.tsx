import { Button } from "./ui/button"
import { formConfig, Log, logConfig } from "./forms/formConfig"
import { FilterButtonsType } from "./dashboardTabs/DashboardLogs"
import { Paragraph } from "./ui/paragraph"

interface FilterLogListInterface {
    year: keyof typeof logConfig
    selectedFilters: FilterButtonsType
    setSelectedFilters: React.Dispatch<React.SetStateAction<FilterButtonsType>>
}

export const FilterLogList = ({
    year,
    selectedFilters,
    setSelectedFilters,
}: FilterLogListInterface) => {
    const logKeys = {
        auto: Object.keys(formConfig[year].defaultForm.auto || {}),
        teleop: Object.keys(formConfig[year].defaultForm.teleop || {}),
    }

    const toggleFilter = (
        key: keyof Log<typeof year>["auto"] | keyof Log<typeof year>["teleop"],
        parent: "auto" | "teleop"
    ) => {
        console.log(parent, key)

        setSelectedFilters((prev) => {
            if (prev[parent].includes(key))
                return {
                    ...prev,
                    [parent]: [...prev[parent].filter((k) => k !== key)],
                }
            return { ...prev, [parent]: [...prev[parent], key] }
        })
    }

    return (
        <div className="flex-col rounded p-2 dark:bg-[#302E2E]">
            {/* Render Auto buttons */}
            <Paragraph>Auto</Paragraph>
            <div className="flex gap-2">
                {logKeys.auto.map((key, i) => {
                    const autoKey = key as keyof Log<typeof year>["auto"]
                    return (
                        <Button
                            key={i}
                            onClick={() => toggleFilter(autoKey, "auto")}
                            className={`${selectedFilters.auto.includes(autoKey) ? "dark:bg-cool-green dark:hover:bg-cool-green/75" : ""}`}
                        >
                            {key}
                        </Button>
                    )
                })}
            </div>

            <br />

            {/* Render Teleop buttons */}
            <Paragraph>Teleop</Paragraph>
            <div className="flex flex-wrap gap-2">
                {logKeys.teleop.map((key, i) => {
                    const teleopKey = key as keyof Log<typeof year>["teleop"]
                    return (
                        <Button
                            key={i}
                            onClick={() => toggleFilter(teleopKey, "teleop")}
                            className={`${selectedFilters.teleop.includes(teleopKey) ? "dark:bg-cool-green enabled:hover:dark:bg-cool-green/75" : ""}`}
                        >
                            {key}
                        </Button>
                    )
                })}
            </div>
        </div>
    )
}
