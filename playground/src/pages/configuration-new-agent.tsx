import { useState } from "react"
import { Button, Flex, Loader, SelectField, TextAreaField, TextField, View } from "@aws-amplify/ui-react"
import { Container } from "../library/container"
import { fmHandlerArns } from "../endpoints"
import { useAgentApiCreateAgent } from "../apis/agent-api/hooks/useCreateAgent"
import { useAgentApiActionList } from "../apis/agent-api/hooks/useActions"

export function ConfigurationNewAgent () {

    const [agentName, setAgentName] = useState("")
    const [agentEndpointDropdown, setAgentEndpointDropdown] = useState(fmHandlerArns[0].name)
    const [agentEndpoint, setAgentEndpoint] = useState("")
    const [systemPrompt, setSystemPrompt] = useState("")
    const [chosenAction, setChosenAction] = useState<string>()
    const createAgent = useAgentApiCreateAgent() 
    const actionListObject = useAgentApiActionList()

    const enabled = !! agentName

    if (actionListObject.isUnloaded() || !actionListObject.value) {
        return <Loader/>
    }

    const onCreate = () => {
        let endpoint = agentEndpointDropdown === 'manual' ? agentEndpoint : agentEndpointDropdown
        createAgent({
            name: agentName, 
            systemPrompt, 
            handlerLambda: endpoint!, 
            actions: chosenAction? [chosenAction] : [] 
        })
    }

    return (
        <View>
            <Container heading="New Agent">
                <TextField label="Agent Name" value={agentName} onChange={(e) => setAgentName(e.target.value)} placeholder="My Agent"/>
                <SelectField
                    label="Agent FM Handler"
                    onChange={(e) => setAgentEndpointDropdown(e.target.value)}
                    value={agentEndpointDropdown}
                >
                    {
                        fmHandlerArns.map((handler:any) => {
                            return <option key={handler.name} value={handler.name}>{handler.label}</option>
                        })
                    }
                    <option value="manual">Specify Custom Arn</option>
                </SelectField>
                {
                    agentEndpointDropdown === "manual" &&
                        <TextField label="Agent FM Handler Lambda" value={agentEndpoint} onChange={(e) => setAgentEndpoint(e.target.value)} placeholder="arn:aws:lambda:us-east-1:0000000:function:MyLambdaFunction"/>
                }
                <TextAreaField label="System Prompt" value={systemPrompt} onChange={(e) => setSystemPrompt(e.target.value)} placeholder="You are an ai agent that ...."/>
            </Container>
            <Container heading="Action">
                <SelectField
                    label="Action"
                    placeholder="No Actions"
                    onChange={(e) => setChosenAction(e.target.value)}
                    value={chosenAction}
                >
                    {
                        actionListObject.value.map(action => (
                            <option key={action.name} value={action.id}>{action.name}</option>
                        ))
                    }
                </SelectField>
            </Container>
            <Flex dir='row' justifyContent='flex-end'>
                <Button variation="primary" onClick={onCreate} disabled={!enabled}>
                    Create Agent
                </Button>
            </Flex>
        </View>
    )
}