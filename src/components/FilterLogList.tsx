// import { useState } from "react"
// import { Button } from "./ui/button"
// import { formConfig, Log, logConfig } from "./forms/formConfig"

// export const FilterLogList = ({ year }: { year: keyof typeof logConfig }) => {
//     const [selectedFilters, setSelectedFilters] = useState<{
//         auto: Partial<keyof Log<typeof year>["auto"]>[]
//         teleop: Partial<keyof Log<typeof year>["teleop"]>[]
//     }>({ auto: [], teleop: [] })
//     const logKeys = {
//         auto: Object.keys(formConfig[year].defaultForm.auto || {}),
//         teleop: Object.keys(formConfig[year].defaultForm.teleop || {}),
//     }

//     const toggleFilter = (
//         key: keyof Partial<Log<typeof year>["auto"]>,
//         parent: "auto" | "teleop"
//     ) => {
//         console.log(parent, key)
//     }
//     return (
//         <div className="rounded p-2 dark:bg-[#302E2E]">
//             {logKeys.auto.map((key, i) => {
//                 return (
//                     <Button key={i} onClick={() => toggleFilter(, "auto")}>
//                         {key}
//                     </Button>
//                 )
//             })}
//         </div>
//     )
// }
