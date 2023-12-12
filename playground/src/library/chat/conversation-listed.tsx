import { useNavigate } from 'react-router-dom'
import { Agent, Conversation } from '../../apis/agent-api/types';
import { Button, View } from '@aws-amplify/ui-react';
import { useState } from 'react';
import { useAgentApiDeleteConversation } from '../../apis/agent-api/hooks/useDeleteConversation';

function timeSince(dateString: string) {

    let seconds = Math.floor((+new Date() - +new Date(dateString)) / 1000);
  
    let interval = seconds / 31536000;
  
    if (interval > 1) {
        return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + " minutes";
    }
    return Math.floor(seconds) + " seconds";
  }

export function AgentApiConversationListed (props: {conversation: Conversation, agent?: Agent}) {

    const nav = useNavigate()
    const [hovering, setHovering] = useState(false)
    const deleteConversation = useAgentApiDeleteConversation()

    const onClick = () => {
        nav(`/chat/view/${props.conversation.id}`)
    }

    const onDelete = (e: any) => {
        e.stopPropagation()
        deleteConversation(props.conversation.id)
            .then(() => {
                nav(`/chat`)
            })
    }

    return (
        <View
            position='relative'
            onMouseEnter={() => setHovering(true)} 
            onMouseLeave={() => setHovering(false)} >
            <Button 
                onClick={onClick} isFullWidth variation='link'>
                <View width='100%'  textAlign='left'>
                    <View>
                        {props.agent?.name || '[deleted agent]'}
                    </View>
                    <View fontSize='small'>
                        {timeSince(props.conversation.timestamp)} ago
                    </View>
                </View>
            </Button>
            { hovering && 
                <Button onClick={onDelete} variation="warning" position='absolute' right={15} bottom={15} height={30} width={30}>
                    <i className="fa-solid fa-trash"></i>
                </Button>
            }
        </View>
    )
}
