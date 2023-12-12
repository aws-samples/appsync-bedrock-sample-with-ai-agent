import { Navigate, Outlet, useNavigate } from "react-router-dom"
import { Button, Flex, Loader, View, useAuthenticator, Text } from "@aws-amplify/ui-react"
import { Container } from "../library/container"
import { ConfigurationActionItem } from "../library/control/action-listed"
import { ConfigurationAgentItem } from "../library/control/agent-listed"
import { useAgentApiAgentList } from "../apis/agent-api"
import { useAgentApiActionList } from "../apis/agent-api/hooks/useActions"
import { enableConfigureAgents } from "../endpoints"

export function ConfigurationPage () {
    
    const agentListObject = useAgentApiAgentList()
    const actionListObject = useAgentApiActionList()
    const authControl = useAuthenticator()
    const nav = useNavigate()

    if (agentListObject.isUnloaded() || !agentListObject.value || actionListObject.isUnloaded() || !actionListObject.value){
        return <Loader/>
    }

    if (!enableConfigureAgents){
        return <Navigate to={'/chat'} />
    }
    
    const agentsRendered = agentListObject.value.map(agent => 
        <ConfigurationAgentItem agent={agent} key={agent.id}/>
    )

    const actionsRendered = actionListObject.value.map(action => 
        <ConfigurationActionItem action={action} key={action.id}/>
    )

    // Render the root configuration page
    return (
        <>
            <View className="sidebar">
                <Container heading="Agents">
                    <Flex direction="column">
                        {agentsRendered}
                    </Flex>
                    <br/>
                    <Button isFullWidth onClick={() => nav("/configuration/agent-new")}>
                        New Agent
                    </Button>
                </Container>
                <Container heading="Actions">
                    <Flex direction="column">
                        {actionsRendered}
                    </Flex>
                    <br/>
                    <Button isFullWidth onClick={() => nav("/configuration/action-new")}>
                        New Action
                    </Button>
                </Container>
                <Container heading="Authentication">
                    <Flex direction="column">
                        <Text padding={10}>
                            Signed in
                        </Text>
                    </Flex>
                    <br/>
                    <Button isFullWidth onClick={() => authControl.signOut()}>
                        Sign Out
                    </Button>
                </Container>
            </View>
            <View className="body">
                <Outlet/>
            </View>
        </>
    )
}