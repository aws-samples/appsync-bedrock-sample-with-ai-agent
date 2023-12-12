import { useSetRecoilState } from "recoil"
import { GraphqlQuery } from "../../invoker"
import { Conversations, Loadable } from "../state"

interface deleteConversationResponse {
    deleteConversation: {
        id: string
    }
}

const deleteConversationQuery = new GraphqlQuery<deleteConversationResponse>(`
    mutation DeleteConversation($id: ID!) {
        deleteConversation(id: $id) {
            id
        }
    }
`)

export function useAgentApiDeleteConversation () {

    const setConversationsValue = useSetRecoilState(Conversations)

    return (id: string) => {
        return deleteConversationQuery.invoke({id})
            .then(() => 
                setConversationsValue(Loadable.unloaded()))
    }

}
