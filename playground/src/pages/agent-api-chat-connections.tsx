import { useAgentApiAgent } from "../apis/agent-api"
import { useParams } from "react-router-dom"
import { Loader, Text } from "@aws-amplify/ui-react"
import { Container } from "../library/container"
import { ConnectedItem } from "../library/chat/tool-conntection"
import { useAgentApiConversation } from "../apis/agent-api/hooks/useConversations"


export function AIAgentChatConnections () {
    
    const {chatId} = useParams()
    const conversationObject = useAgentApiConversation(chatId)
    const agentObject = useAgentApiAgent(conversationObject.value?.agent)

    if (agentObject.isUnloaded() || conversationObject.isUnloaded() || !agentObject.value || !conversationObject.value) {
        return <Container heading="Connections" minHeight={200}>
            <Loader/>
        </Container>
    }
    
    // add any agent connections
    let connections:any = {}
    agentObject.value.actions.forEach(action => connections[action.resource] = action)

    return (
        <Container heading="Actions">
            {
                Object.keys(connections).length > 0 &&
                    Object.keys(connections).map(key => {
                        return <ConnectedItem {...connections[key]} key={key} />
                    })
            }
            {
                Object.keys(connections).length === 0 &&
                    <Text>
                        No Actions
                    </Text>
            }
        </Container> 
    )
}