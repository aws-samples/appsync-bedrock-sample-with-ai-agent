import { useRecoilState } from "recoil"
import { GraphqlQuery } from "../../invoker"
import { Conversation } from "../types"
import * as AgentApiStore from "../state"
import { useEffect, useMemo } from "react"
import { useAgentApiConversationList } from "./useConversations"
import { Loadable } from "../state"

interface LoadConversationResult {
    getConversation: Conversation
}

const loadConversationQuery = new GraphqlQuery<LoadConversationResult>(`
    query Conversation($id: ID!) {
        getConversation(id: $id) {
            timestamp
            agent
            events {
                id
                conversationId
                sender
                timestamp
                event {
                    message
                    innerDialog
                    actionRequested
                    actionResult
                    audioFileUrl
                }
            }
        }
    }
`)

export function useAgentApiConversationWithMessages (id: string = '') {

    const conversationListObject = useAgentApiConversationList()
    const conversation = conversationListObject.value?.items().find(item => item.id === id);
    const [eventsState, setState] = useRecoilState(AgentApiStore.ConversationEvents)

    const targetConversation = eventsState[id] || Loadable.unloaded()

    useEffect(() => {

        if ( !id || !(targetConversation.loading === 'unloaded') ) return
        
        setState((data) => {
            let newConversationEvents = { ...data }
            newConversationEvents[id] = AgentApiStore.Loadable.loading()
            return newConversationEvents
        })

        loadConversationQuery.invoke({id}) //Invoke
            .then(({getConversation: result}) => 
                setState((data) => {

                    let targetConversationEvents = data[id]

                    if (!targetConversationEvents || !targetConversationEvents.isLoaded()){
                        targetConversationEvents = AgentApiStore.Loadable.loaded([])
                    }

                    let newConversationEvents = { ...data }
                    let newTargetConversationEvents = [
                        ...targetConversationEvents.value!
                    ]

                    newTargetConversationEvents.push(...result.events)
                    newConversationEvents[id] = AgentApiStore.Loadable.loaded(newTargetConversationEvents)

                    return newConversationEvents
                })
            )
    
    }, [id, setState, targetConversation.loading])

    const filteredEvents = useMemo(() => {
        let items = eventsState[id]?.value
        if (!items) return []
        return [...items].sort((a, b) => +new Date(a.timestamp) - +new Date(b.timestamp))
    }, [eventsState, id])

    return {
        loadingConversation: targetConversation.loading !== 'loaded',
        events: filteredEvents,
        conversation
    }
}