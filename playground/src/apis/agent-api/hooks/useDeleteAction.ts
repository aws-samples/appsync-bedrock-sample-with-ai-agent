import { GraphqlQuery } from "../../invoker";
import { useSetRecoilState } from "recoil";
import { Actions, Loadable } from "../state";

interface DeleteActionResponse {
    deleteAction: {
        id: string
    }
}

const deleteActionQuery = new GraphqlQuery<DeleteActionResponse>(`
    mutation DeleteAction($id: ID!) {
        deleteAction(id: $id) {
            id
        }
    }
`)

export function useAgentApiDeleteAction () {

    const setActionsValue = useSetRecoilState(Actions)

    return (id: string = '') => {
        return deleteActionQuery.invoke({ id })
            .then(() => 
                setActionsValue(Loadable.unloaded()))
    }

}
