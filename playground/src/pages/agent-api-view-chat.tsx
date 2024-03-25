import { useParams } from "react-router-dom"
import { useAgentApiAgent, useAgentApiSendMessage, useAgentApiSubscribeConversation } from "../apis/agent-api"
import { Loader, TextAreaField, View, Flex, Card } from "@aws-amplify/ui-react"
import { Container } from "../library/container"
import { ChatRendered } from "../library/chat/chat-rendered"
import { useEffect, useState } from "react"
import { AIAgentChatConnections } from "./agent-api-chat-connections"
import { useAgentApiConversation } from "../apis/agent-api/hooks/useConversations"
import { useAgentConversationMetadata, useResetAgentConversationMetadata } from "../apis/agent-api/hooks/useMetadata"
import {AudioRecorder} from "../library/chat/audio-recorder";

/*
* Chat Dialog & Actions
* */

export function AIAgentViewChat () {
    
    const {chatId} = useParams()
    const conversationObject = useAgentApiConversation(chatId)
    const agentObject = useAgentApiAgent(conversationObject.value?.agent)
    const [chatString, setChatString] = useState<string>()
    const conversationMetadata = useAgentConversationMetadata()
    const resetMetadata = useResetAgentConversationMetadata()
    const submitMessage = useAgentApiSendMessage(chatId)
    useAgentApiSubscribeConversation(chatId)

    //TODO: Add a lanuage selector
    //https://ui.docs.amplify.aws/react/components/selectfield

    //@ts-nocheck
    useEffect(() => {
        if (conversationMetadata.partialMessage && !conversationMetadata.responding) {
            resetMetadata()
        }
    }, [chatId, resetMetadata, conversationMetadata])

    if (conversationObject.isUnloaded() || !conversationObject.value || agentObject.isUnloaded() || !agentObject.value) {
        return <Loader/>
    }

    const handleRecordingComplete = async (audioFileUrl: string) => {

        // Send the message with the audio file URL
        console.log("handleRecordingComplete")
        submitMessage({ message: chatString, audioFileUrl: audioFileUrl });
        setChatString('')
      // Fetch pre-signed URL from your backend
      // const response = await fetch('/api/get-presigned-url');
      // const { uploadURL } = await response.json();

      // Use fetch or Axios to PUT the blob to the pre-signed URL
      // const uploadResponse = await fetch(uploadURL, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'audio/webm;codecs=opus', // Or the correct content type of your audio blob
      //   },
      //   body: audioBlob,
      // });

      // if (uploadResponse.ok) {
      //   console.log('Upload successful');
      //   // Optionally, notify your backend about the new file or update your UI accordingly
      // } else {
      //   console.error('Upload failed');
      // }
    };


    return (
        <Flex>
            <View width={900}>
                <Container heading={`Chatting with '${agentObject.value.name}'`} minHeight={500} padBody={0}>
                    <ChatRendered/>
                </Container>
                <AudioRecorder onRecordingComplete={handleRecordingComplete}/>
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
                                    const audioFileUrl = "http://www.kittentech.com"
                                    // Send the message with the audio file URL
                                    submitMessage({ message: chatString, audioFileUrl: audioFileUrl });
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