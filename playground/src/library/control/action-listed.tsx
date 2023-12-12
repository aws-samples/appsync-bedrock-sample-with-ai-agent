import { useNavigate } from 'react-router-dom'
import { Button } from '@aws-amplify/ui-react'
import { Action } from '../../apis/agent-api/types'

export function ConfigurationActionItem (props: {action: Action}) {

    const nav = useNavigate()

    const onClick = () => {
        nav(`/configuration/action/${props.action.id}`)
    }

    return (
        <Button onClick={onClick} isFullWidth variation='link' justifyContent='left'>
            {props.action.name}
        </Button>
    )
}