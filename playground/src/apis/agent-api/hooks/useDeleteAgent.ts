import { useSetRecoilState } from "recoil";
import { GraphqlQuery } from "../../invoker";
import { Agents, Loadable } from "../state";

interface DeleteAgentResponse {
    deleteAgent: {
        id: string
    }
}

const deleteAgentQuery = new GraphqlQuery<DeleteAgentResponse>(`
    mutation DeleteAgent($id: ID!) {
        deleteAgent(id: $id) {
            id
        }
    }
`)

export function useAgentApiDeleteAgent () {

    const setAgentsValue = useSetRecoilState(Agents)

    return (id: string = '') => {
        return deleteAgentQuery.invoke({ id })
            .then(() => setAgentsValue(Loadable.unloaded()))
    }
}
