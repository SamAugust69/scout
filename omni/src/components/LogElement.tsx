interface LogElementInterface {
    renderAsListElement: boolean
}

export const LogElement = ({ renderAsListElement }: LogElementInterface) => {
    return (
        <div
            className={`p-2 ${renderAsListElement ? "bg-white" : "bg-red-400"}`}
        ></div>
    )
}
