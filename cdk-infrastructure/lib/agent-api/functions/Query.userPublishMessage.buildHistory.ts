import { Context } from '@aws-appsync/utils'

const USER_PREFIX = 'Human: '
const AGENT_PREFIX = 'Assistant: '

export function request(ctx: Context) {

    // Build a chat history for easy use later on
    let chatHistory = []
    let requestIdMaps: any = {}

    // For each event, build a chat message
    for (let eventData of ctx.stash.conversationData.events){

        requestIdMaps[eventData.id] = eventData.event

        if (eventData.event.message){
            chatHistory.push({
                sender: eventData.sender,
                text: eventData.event.message
            })
        }
        
        else if (eventData.event.innerDialog){
            chatHistory.push({
                sender: eventData.sender,
                text: eventData.event.innerDialog
            })
        }

        else if (eventData.event.actionResult){
            chatHistory.push({
                sender: eventData.sender,
                text: `Here is the result of the execution ${eventData.event.actionResult}`
            })
        }

        else if (eventData.event.actionRequested){
            chatHistory.push({
                sender: eventData.sender,
                text: `Attempting to invoke the following: ${eventData.event.actionRequestedContent}`
            })
        }
    }

    // Add this message if needed
    if (ctx.arguments.event.message){
        chatHistory.push({
            sender: 'user',
            text: ctx.arguments.event.message
        })
    }
    if (ctx.arguments.event.actionRequested){
        chatHistory.push({
            sender: 'user',
            text: `I have invoked the the following for you: ${ctx.arguments.event.actionRequestedContent} and have gotten the result of ${ctx.arguments.event.actionResult}`
        })
    }

    // Chat string being built
    let chatString = ''

    for (let chatEvent of chatHistory){
        let sender = chatEvent.sender === 'user' ? USER_PREFIX : AGENT_PREFIX
        chatString += sender + chatEvent.text + '\n'
    }

    // If we have a system prompt, add it as a first, hidden message
    if (ctx.stash.agentData.systemPrompt){
        chatString = USER_PREFIX + ctx.stash.agentData.systemPrompt + '\n' + AGENT_PREFIX + 'understood\n' + chatString
    }

    if (!chatString.startsWith(USER_PREFIX))
        chatString = USER_PREFIX + "\n" + chatString

    ctx.stash.chatString = chatString
    return {}
}

export function response(ctx: Context) {
    return ctx.prev.result;
}