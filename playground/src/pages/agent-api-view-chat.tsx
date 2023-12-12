import { useParams } from "react-router-dom"
import { useAgentApiAgent, useAgentApiSendMessage, useAgentApiSubscribeConversation } from "../apis/agent-api"
import { Loader, TextAreaField, View, Flex, Card } from "@aws-amplify/ui-react"
import { Container } from "../library/container"
import { ChatRendered } from "../library/chat/chat-rendered"
import { useEffect, useState } from "react"
import { AIAgentChatConnections } from "./agent-api-chat-connections"
import { useAgentApiConversation } from "../apis/agent-api/hooks/useConversations"
import { useAgentConversationMetadata, useResetAgentConversationMetadata } from "../apis/agent-api/hooks/useMetadata"

export function AIAgentViewChat () {
    
    const {chatId} = useParams()
    const conversationObject = useAgentApiConversation(chatId)
    const agentObject = useAgentApiAgent(conversationObject.value?.agent)
    const [chatString, setChatString] = useState<string>()
    const conversationMetadata = useAgentConversationMetadata()
    const resetMetadata = useResetAgentConversationMetadata()
    const submitMessage = useAgentApiSendMessage(chatId)
    useAgentApiSubscribeConversation(chatId)

    //@ts-nocheck
    useEffect(() => {
        if (conversationMetadata.partialMessage && !conversationMetadata.responding) {
            resetMetadata()
        }
    }, [chatId, resetMetadata, conversationMetadata])

    if (conversationObject.isUnloaded() || !conversationObject.value || agentObject.isUnloaded() || !agentObject.value) {
        return <Loader/>
    }

    return (
        <Flex>
            <View width={900}>
                <Container heading={`Chatting with '${agentObject.value.name}'`} minHeight={500} padBody={0}>
                    <ChatRendered/>
                </Container>  
                <Card>
                    {
                        conversationMetadata.responding && <Loader variation="linear"/>
                    }
                    {
                        !conversationMetadata.responding && <TextAreaField 
                            labelHidden
                            label="Message"
                            placeholder="Type your message here"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    submitMessage({message: chatString})
                                    setChatString('')
                                    e.preventDefault()
                                }
                            }}
                            value={chatString}
                            onChange={(e) => {
                                setChatString(e.target.value)
                            }} 
                        />
                    }
                </Card>
            </View>
            <View width={300}>
                <AIAgentChatConnections/>
            </View>
        </Flex>
    )
}