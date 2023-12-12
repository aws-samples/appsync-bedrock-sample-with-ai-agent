import { useRecoilState } from "recoil"
import { GraphqlQuery } from "../../invoker"
import { Agent } from "../types"
import { useEffect } from "react"
import { Agents, Loadable, ObjRecord } from "../state"

interface GetAgentResponse {
    listAgents: Agent[]
}

const listAgentsQuery = new GraphqlQuery<GetAgentResponse>(`
    query {
        listAgents {
            id
            name
            timestamp
            handlerLambda
            systemPrompt
            actions {
                id
                type
                name
                resource
            }
        }
    }
`)

export function useAgentApiAgentList () {

    const [agentsState, setAgentsState] = useRecoilState(Agents)

    useEffect(() => {
        if (!agentsState.isUnloaded()) {
            return
        }

        setAgentsState(Loadable.loading())

        listAgentsQuery.invoke()
            .then((result) => {
                setAgentsState(
                    Loadable.loaded(
                        ObjRecord.of( result.listAgents )
                    )
                )
            })
    }, [agentsState, setAgentsState])

    return agentsState
    
}

export function useAgentApiAgent (id: string = ''): Loadable<Agent> {

    const agents = useAgentApiAgentList()

    if (agents.isUnloaded() || !agents.value) {
        return Loadable.loading()
    }

    return Loadable.loaded(agents.value.get(id))
}