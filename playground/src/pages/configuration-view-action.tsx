import { useNavigate, useParams } from "react-router-dom"
import { Button, Flex, Text, Loader, TextField, View } from "@aws-amplify/ui-react"
import { Container } from "../library/container"
import reactUseCookie from "react-use-cookie"
import { useAgentApiAction } from "../apis/agent-api/hooks/useActions"
import { useAgentApiDeleteAction } from "../apis/agent-api/hooks/useDeleteAction"

export function ConfigurationViewAction () {

    // Page state and nav
    const {actionId} = useParams()
    const nav = useNavigate()
    const [apiKey, setApiKey] = reactUseCookie(actionId || '', '')

    // Recoil states
    const actionObject = useAgentApiAction(actionId)
    const deleteAction = useAgentApiDeleteAction()    

    if (actionObject.isUnloaded()) {
        return <Loader />
    }
    
    const onDelete = () => {
        deleteAction(actionId).then(() => {
            nav('/configuration')
        })
    }

    // Render page which can view actions and in readonly mode
    return (
        <View>
            <Container heading="View Action">
                <TextField disabled label="Action Name" value={actionObject.value?.name}/>
                <TextField disabled label="Action Type" value={actionObject.value?.type}/>
                <TextField disabled label="Action Resources" value={actionObject.value?.resource}/>
            </Container>
            <Container heading="Credentials">
                <Text padding='small'>
                    This are stored locally in the browser and allow you to manually invoke action if needed.
                </Text>
                <TextField label="Api Key" value={apiKey} onChange={(e) => setApiKey(e.target.value)}/>
            </Container>
            <Flex dir='right' justifyContent='end'>
                <Button variation='warning' size='small' onClick={onDelete}>
                    Delete Action
                </Button>
            </Flex>
        </View>
    )
}