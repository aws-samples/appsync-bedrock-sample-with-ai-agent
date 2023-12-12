import { useSetRecoilState } from "recoil"
import { GraphqlQuery } from "../../invoker"
import { Conversations, Loadable } from "../state"

interface CreateConversationResponse {
    createConversation: {
        id: string
    }
}

const createConversationQuery = new GraphqlQuery<CreateConversationResponse>(`
    mutation CreateConversation($config: NewConversation) {
        createConversation(config: $config) {
            id
        }
    }
`)

export function useAgentApiCreateConversation () {

    const setConversationsValue = useSetRecoilState(Conversations)

    return (agent: string) => {
        return createConversationQuery.invoke({config: {agent}})
            .then(c => {
                setConversationsValue(Loadable.unloaded())
                return c
            })
    }

}
