import { useRecoilState } from "recoil"
import { useEffect } from "react"
import { GraphqlQuery } from "../../invoker"
import { Actions, Loadable, ObjRecord } from "../state"
import { Action } from "../types"


interface GetActionsResponse {
    listActions: Action[]
}

const listActionsQuery = new GraphqlQuery<GetActionsResponse>(`
    query MyQuery {
        listActions {
            id
            name
            resource
            type
        }
    }
`)

export function useAgentApiActionList () {

    const [actionsState, setActionsState] = useRecoilState(Actions)

    useEffect(() => {

        if (!actionsState.isUnloaded()){
            return 
        }
        
        setActionsState(Loadable.loading())

        listActionsQuery.invoke()
            .then((result) => {
                setActionsState(
                    Loadable.loaded(
                        ObjRecord.of( result.listActions )
                    )
                )
            })
            
    }, [actionsState, setActionsState])

    return actionsState
}

export function useAgentApiAction (id: string = '') : Loadable<Action> {

    const actions = useAgentApiActionList()

    if (actions.isUnloaded() || !actions.value) {
        return Loadable.loading()
    }

    return Loadable.loaded(actions.value.get(id))
}

