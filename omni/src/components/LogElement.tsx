interface LogElementInterface {
    renderAsListElement: boolean
}

export const LogElement = ({ renderAsListElement }: LogElementInterface) => {
    return <div className="bg-white p-2"></div>
}
