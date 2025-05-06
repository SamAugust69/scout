import { useParams } from "react-router-dom"

export const TeamDashboard = () => {
    const { id, team } = useParams()

    return (
        <div>
            {id} {team}
        </div>
    )
}
