import { AgentApiConversationListed } from "../library/chat/conversation-listed"
import { Outlet, useNavigate } from "react-router-dom"
import { useAgentApiAgentList, useAgentApiConversationList } from "../apis/agent-api"
import { Button, Flex, Loader, View } from "@aws-amplify/ui-react"
import { Container } from "../library/container"

export function AIAgentSidebar () {
    
    const conversationsObject = useAgentApiConversationList()
    const agentObjectList = useAgentApiAgentList()

    const nav = useNavigate()

    if (conversationsObject.isUnloaded() || !conversationsObject.value || agentObjectList.isUnloaded() || !agentObjectList.value) {
        return <Loader/>
    }
    
    const conversationsRendered = conversationsObject.value.items()
        .sort((c1, c2) => c1.timestamp < c2.timestamp ? 1 : -1)
        .map(conversation => 
            <AgentApiConversationListed 
                agent={agentObjectList.value?.items().find(agent => agent.id === conversation.agent)}
                conversation={conversation} 
                key={conversation.id}/>
        )    

    return (
        <View>
            <View className="sidebar">
                <Container heading="Your Conversations">
                    <Flex direction='column' gap={10} maxHeight={'calc(100vh - 150px)'} overflow='auto'>
                        {conversationsRendered}
                    </Flex>
                    <br/>
                    <Button isFullWidth onClick={() => nav("/chat/new")}>
                        New Conversation
                    </Button>
                </Container>
            </View>
            <View className="body">
                <Outlet/>
            </View>
        </View>
    )
}