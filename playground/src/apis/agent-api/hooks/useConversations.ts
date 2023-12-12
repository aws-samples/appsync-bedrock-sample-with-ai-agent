import { useRecoilState } from "recoil"
import { GraphqlQuery } from "../../invoker"
import { Conversation } from "../types"
import { useEffect } from "react"
import { Conversations, Loadable, ObjRecord } from "../state"

interface GetConversationResponse {
    listConversations: Conversation[]
}

const loadConversationQuery = new GraphqlQuery<GetConversationResponse>(`
    query {
        listConversations {
            timestamp
            agent
            id
        }
        }
    `
)

export function useAgentApiConversationList () {

    const [conversationsState, setConversationsState] = useRecoilState(Conversations)

    useEffect(() => {

        if (!conversationsState.isUnloaded()){
            return
        }
        
        setConversationsState(Loadable.loading())

        loadConversationQuery.invoke()
            .then((result) => 
                setConversationsState(
                    Loadable.loaded(
                        ObjRecord.of(result.listConversations)
                    )
                )
            )
            
    }, [conversationsState, setConversationsState])

    return conversationsState
}

export function useAgentApiConversation (id: string = '') : Loadable<Conversation> {

    const actions = useAgentApiConversationList()

    if (actions.isUnloaded() || !actions.value) {
        return Loadable.loading()
    }

    return Loadable.loaded(actions.value.get(id))
}

