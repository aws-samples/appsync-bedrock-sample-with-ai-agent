import { useNavigate, useParams } from "react-router-dom"
import { Button, Flex, Loader, TextAreaField, TextField, View } from "@aws-amplify/ui-react"
import { Container } from "../library/container"
import { useAgentApiAgent } from "../apis/agent-api"
import { useAgentApiActionList } from "../apis/agent-api/hooks/useActions"
import { useAgentApiDeleteAgent } from "../apis/agent-api/hooks/useDeleteAgent"

export function ConfigurationViewAgent () {

    const {agentId} = useParams()
    const nav = useNavigate()
    const agentObject = useAgentApiAgent(agentId)
    const actionListObject = useAgentApiActionList()
    const deleteAgent = useAgentApiDeleteAgent()

    if (agentObject.isUnloaded() || !agentObject.value || actionListObject.isUnloaded()) {
        return <Loader />
    }

    const onDelete = () => {
        deleteAgent(agentId)
            .then(() => nav('/configuration'))
    }

    const agent = agentObject.value
    const listedActions = agent.actions.map(a => a.name).join(', ')

    return (
        <View>
            <Container heading="View Agent">
                <TextField disabled label="Agent Name" value={agent?.name} placeholder="My Agent"/>
                <TextField disabled label="Agent FM Handler" value={agent?.handlerLambda} placeholder="arn:aws:lambda:us-east-1:0000000:function:MyLambdaFunction"/>
                <TextAreaField disabled label="System Prompt" value={agent?.systemPrompt} placeholder="My Prompt"/>
                <TextField disabled label="Agent actions" value={listedActions} placeholder=""/>
            </Container>
            <Flex dir='right' justifyContent='end'>
                <Button variation="warning" onClick={onDelete} size='small'>
                    Delete Agent
                </Button>
            </Flex>
        </View>
    )
}