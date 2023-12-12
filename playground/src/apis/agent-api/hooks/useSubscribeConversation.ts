import { useRecoilState, useSetRecoilState } from "recoil";
import * as AgentApiStore from "../state"
import { useEffect } from "react";
import { API } from '@aws-amplify/api';
import { ConversationEvent, ConversationMetadata } from "../types";

export function subscribeConversationMessages(conversationId: string): any {

    console.log('Subscribed', 'subscribeConversationMessages')

    const query = `
        subscription MySubscription($cid: ID!) {
            onConversationEvents(conversationId: $cid) {
                id
                sender
                timestamp
                conversationId
                event {
                    actionRequested
                    actionResult
                    innerDialog
                    message
                }
            }
        }  
    `;

    return API.graphql({ 
        query: query,
        variables: { cid: conversationId }
    })      

}

export function subscribeConversationEvents(conversationId: string): any {

    console.log('Subscribed', 'subscribeConversationEvents')

    const query = `
        subscription MySubscription($cid: ID!) {
            onConversationMetadata(conversationId: $cid) {
                conversationId
                agentStartResponding
                agentStopResponding
                agentPartialMessage
            }
        }  
    `;


    return API.graphql({ 
        query: query,
        variables: { cid: conversationId }
    })      

}

export function useAgentApiSubscribeConversation (id: string = '') {

    const [eventsState, setEventsState] = useRecoilState(AgentApiStore.ConversationEvents)
    const setPartialState = useSetRecoilState(AgentApiStore.ConversationPartialResults)
    const {loading} = eventsState;

    useEffect(() => {
        if (loading || !id ) return
        const subscriptionMessages = subscribeConversationMessages(id)
        const subscriptionEvents = subscribeConversationEvents(id)

        function onConversationGetsNewMessage (data: ConversationEvent){
            let partialData = ''
            setPartialState((partial) => {
                partialData = partial.partialMessage
                return {
                    ...partial,
                    partialMessage: ''
                }
            })
            setEventsState((events) => {
                let newData = JSON.parse(JSON.stringify(events))
                newData[id]?.value?.push({
                    ...data,
                    disableTyping: !!partialData
                })
                return newData
            })
            
        }

        function onConversationGetsNewMetadata (data: ConversationMetadata) {
            setPartialState((partial) => {
                let newResultData = {...partial}
                if (data.agentPartialMessage){
                    newResultData.partialMessage += data.agentPartialMessage
                }
                if (data.agentStartResponding){
                    newResultData.responding = true
                }
                if (data.agentStopResponding){
                    newResultData.responding = false
                }
                return newResultData
            })
        }

        const subscriptionListener = subscriptionMessages.subscribe((sub:any) => {
            if (sub.value.data.onConversationEvents){
                onConversationGetsNewMessage(sub.value.data.onConversationEvents)
            }
        })

        const subscriptionListenerMetadata = subscriptionEvents.subscribe((sub:any) => {
            if (sub.value.data.onConversationMetadata){
                onConversationGetsNewMetadata(sub.value.data.onConversationMetadata)
            }
        })

        return () => {
            subscriptionListener.unsubscribe()
            subscriptionListenerMetadata.unsubscribe()
        }

    }, [id, loading, setEventsState, setPartialState])

}
