import { Button, Flex, Loader, SelectField } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { useAgentApiAgentList, useAgentApiCreateConversation } from "../apis/agent-api"
import { Container } from '../library/container';

export function AIAgentNewChat () {
    
    const agentListObject = useAgentApiAgentList()
    const [selectedAgent, setSelectedAgent] = useState<string>('')
    const createConversation = useAgentApiCreateConversation()
    const nav = useNavigate()

    if (agentListObject.isUnloaded() || !agentListObject.value) {
        return <Loader/>
    }

    let onCreate = () => {
        createConversation(selectedAgent)
            .then(c => nav('/chat/view/' + c.createConversation.id))
    }

    let selectionOptions = agentListObject.value.map(a => 
        <option value={a.id} key={a.id}>{a.name}</option>
    )
    
    return (
        <div>
            <Container heading="Start New Conversation">
                <SelectField 
                    label="Agent"
                    placeholder="Choose An Agent"
                    value={selectedAgent}
                    onChange={(e) => setSelectedAgent(e.target.value)}
                >
                    {
                        selectionOptions
                    }
                </SelectField>
            </Container>
            <br/>
            <Flex dir='row' justifyContent='flex-end'>
                <Button disabled={!selectedAgent} variation='primary' size='small' type='button' onClick={onCreate}>
                    Start Chat
                </Button>
            </Flex>
        </div>
    )
}