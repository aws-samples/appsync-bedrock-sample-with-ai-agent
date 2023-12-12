import { useState } from "react"
import { Button, Flex, SelectField, TextField, View } from "@aws-amplify/ui-react"
import { Container } from "../library/container"
import { appsyncActionOutputs } from "../endpoints"
import { useAgentApiCreateAction } from "../apis/agent-api/hooks/useCreateAction"

enum ActionType {
    AppsyncApi = "Appsync API"
}

export function ConfigurationNewAction () {

    const [ActionName, setActionName] = useState("")
    const [actionType, setActionType] = useState(ActionType.AppsyncApi)
    const createAction = useAgentApiCreateAction()

    // Appsync api endpoint
    const [appsyncEndpointDropdown, setAppsyncEndpointDropdown] = useState(appsyncActionOutputs[0].endpoint)
    const [appsyncEndpoint, setAppsyncEndpoint] = useState("")

    const enabled = ActionName.length > 0

    const onCreate = () => {
        
        let resource = appsyncEndpointDropdown === 'manual'  ? appsyncEndpoint : appsyncEndpointDropdown

        createAction({
            name: ActionName,
            type: actionType,
            resource: resource!
        })
    }

    return (
        <View>
            <Container heading="New Action">
                <TextField
                    padding={10}
                    name="Action Name"
                    value={ActionName}
                    onChange={(e) => setActionName(e.target.value)}
                    placeholder="My Action"
                    label="Action Name"
                />
                <SelectField 
                    padding={10}
                    placeholder=""
                    name="Action Type" 
                    value={ActionType.toString()} 
                    onChange={(e) => setActionType(e.target.value as ActionType)}
                    label="Action Type"
                >
                    <option value={ActionType.AppsyncApi}>{ActionType.AppsyncApi}</option>
                </SelectField>
                {
                    actionType === ActionType.AppsyncApi && (
                        <div>
                            <SelectField
                                label="Appsync Action Endpoint"
                                onChange={(e) => setAppsyncEndpointDropdown(e.target.value)}
                                value={appsyncEndpointDropdown}
                            >
                                {
                                    appsyncActionOutputs.map((handler:any) => {
                                        return <option key={handler.endpoint} value={handler.endpoint}>{handler.label}</option>
                                    })
                                }
                                <option value="manual">Specify Custom Endpoint</option>
                            </SelectField>
                            {
                                appsyncEndpointDropdown === "manual" &&
                                    <TextField label="Agent Action Endpoint" value={appsyncEndpoint} onChange={(e) => setAppsyncEndpoint(e.target.value)} placeholder="https://xxxxxxxxxxxxxxxx.appsync-api.aa-region-0.amazonaws.com/graphql/"/>
                            }
                        </div>   
                    )
                }
            </Container>
            <Flex dir='row' justifyContent='flex-end'>
                <Button variation="primary" onClick={onCreate} disabled={!enabled}>
                    Create Action
                </Button>
            </Flex>
        </View>
    )
}