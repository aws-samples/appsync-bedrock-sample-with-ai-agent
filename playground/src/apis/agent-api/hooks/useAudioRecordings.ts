import { useSetRecoilState } from "recoil"
import { GraphqlQuery, Invoke } from "../../invoker"
import { AudioRecordings, Loadable } from "../state"
import { AudioRecording } from "../types"

interface SendAudioRecordingResult {
    userPublishAudio: AudioRecording
}

const sendAudioBlobQuery = new GraphqlQuery<SendAudioRecordingResult>(`
    mutation SendMessage($cid: ID!, $event: UserAction!) {
        userPublishAudio(conversationId: $cid, event: $event){
            id
            conversationId
            eventId
            sender
            timestamp
            url
        }
    }
`)

export function useAgentApiAudioRecordings (cid: string = '') {

    const setAudioRecordings = useSetRecoilState(AudioRecordings)

    return async (event: any) => {
        sendAudioBlobQuery.invoke({cid, event})
            .then(result => {
                setAudioRecordings((data) => {

                    let targetAudioRecordings = data[cid]
                    if (!targetAudioRecordings || targetAudioRecordings.loading !== 'loaded'){
                        targetAudioRecordings = Loadable.loaded([])
                    }

                    let newAudioRecordings = { ...data }
                    let newTargetAudioRecordings = [
                        ...targetAudioRecordings.value!
                    ]
                    
                    newTargetAudioRecordings.push(result.userPublishAudio)
                    //newAudioRecordings[cid] = Loadable.loaded(targetAudioRecordings)
                    return newAudioRecordings
                })
            })
        
    }
}

export function useAgentApiInvokeQuery (conversationId: string = '') {
    
    const sendAudioRecordingHook = useAgentApiAudioRecordings(conversationId)
    
    return (endpoint: string, request: string, apiKey: string) => {

        if (!apiKey) {
            alert('please set an api key for playground invocation of this action in the configuration for the action')
            return
        }
        
        Invoke(request, {}, endpoint, {
            'x-api-key': apiKey
        })
            .then(result => {
                let resultString = JSON.stringify(result)
                sendAudioRecordingHook({
                    actionRequested: request,
                    actionResult: resultString
                })
            })
    }
}