import { useNavigate } from 'react-router-dom'
import { Button } from '@aws-amplify/ui-react'
import { Agent } from '../../apis/agent-api/types'

export function ConfigurationAgentItem (props: {agent: Agent}) {

    const nav = useNavigate()

    const onClick = () => {
        nav(`/configuration/agent/${props.agent.id}`)
    }

    return (
        <Button onClick={onClick} isFullWidth variation='link' justifyContent='left'>
            {props.agent.name}
        </Button>
    )
}
