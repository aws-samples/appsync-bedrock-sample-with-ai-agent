import { useRecoilValue, useSetRecoilState } from "recoil"
import { ConversationPartialResults } from "../state"

export function useAgentConversationMetadata () {
    return useRecoilValue(ConversationPartialResults)
}

export function useResetAgentConversationMetadata () {
    const setMetadataState = useSetRecoilState(ConversationPartialResults)
    return () => setMetadataState({
        partialMessage: '',
        responding: false
    })
}