import { useSetRecoilState } from "recoil"
import { GraphqlQuery, Invoke } from "../../invoker"
import { ConversationEvents, Loadable } from "../state"
import { ConversationEvent } from "../types"

interface SendMessageResult {
    userPublishMessage: ConversationEvent
}

const sendConversationMessageQuery = new GraphqlQuery<SendMessageResult>(`
    mutation SendMessage($cid: ID!, $event: UserAction!) {
        userPublishMessage(conversationId: $cid, event: $event){
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
`)

export function useAgentApiSendMessage (cid: string = '') {

    const setConversationEvents = useSetRecoilState(ConversationEvents)

    return async (event: any) => {
        sendConversationMessageQuery.invoke({cid, event})
            .then(result => {
                setConversationEvents((data) => {

                    let targetConversationEvents = data[cid]
                    if (!targetConversationEvents || targetConversationEvents.loading !== 'loaded'){
                        targetConversationEvents = Loadable.loaded([])
                    }

                    let newConversationEvents = { ...data }
                    let newTargetConversationEvents = [
                        ...targetConversationEvents.value!
                    ]
                    
                    newTargetConversationEvents.push(result.userPublishMessage)
                    newConversationEvents[cid] = Loadable.loaded(newTargetConversationEvents)
                    return newConversationEvents
                })
            })
        
    }
}

export function useAgentApiInvokeQuery (conversationId: string = '') {
    
    const sendMessageHook = useAgentApiSendMessage(conversationId) 
    
    return (endpoint: string, request: string, apiKey: string) => {

        if (!apiKey) {
            alert('please set an api key for playground invocation of this action in the configuration for the action')
            return
        }
        
        Invoke(request, {}, endpoint, {
            'x-api-key': apiKey
        })
            .then(result => {
                let resultString = JSON.stringify(result)
                sendMessageHook({
                    actionRequested: request,
                    actionResult: resultString
                })
            })
    }
}