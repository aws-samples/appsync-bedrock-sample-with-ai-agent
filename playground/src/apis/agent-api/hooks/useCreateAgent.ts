import { Agent } from "../types";
import { useSetRecoilState } from "recoil";
import { GraphqlQuery } from "../../invoker";
import { Agents, Loadable } from "../state";

export interface CreateAgentResponse {
    createAgent: Agent
}

export interface CreateAgentArgs {
    name: string
    systemPrompt: string
    handlerLambda: string
    actions: string[]
}

const createAgentQuery = new GraphqlQuery<CreateAgentResponse>(`
    mutation CreateAgent($handlerLambda: String!, $systemPrompt: String!, $name: String!, $actions: [String!]!){
        createAgent(config: {name: $name, handlerLambda: $handlerLambda, systemPrompt: $systemPrompt, actions: $actions}) {
            id
            name
            handlerLambda
            systemPrompt
        }
    }
`)

export function useAgentApiCreateAgent () {

    const setAgentsValue = useSetRecoilState(Agents)

    return (request: CreateAgentArgs) => {
        createAgentQuery.invoke(request)
            .then((result) => 
                setAgentsValue(Loadable.unloaded()))
    }
}
