import { useSetRecoilState } from "recoil";
import { GraphqlQuery } from "../../invoker";
import { Action } from "../types";
import { Actions, Loadable } from "../state";

interface CreateActionResponse {
    createAction: Action
}

interface CreateActionArgs {
    name: string
    type: string
    resource: string
}

const createActionQuery = new GraphqlQuery<CreateActionResponse>(`
    mutation CreateAction($resource: String!, $name: String!, $type: String!){    
        createAction(config: {resource: $resource, type: $type, name: $name}) {
            id
            name
            resource
            type
        }
    }
`)

export function useAgentApiCreateAction () {

    const setActionState = useSetRecoilState(Actions)

    return (params: CreateActionArgs) => {
        return createActionQuery.invoke(params)
            .then(() => 
                setActionState(Loadable.unloaded())
            )
    }

}
