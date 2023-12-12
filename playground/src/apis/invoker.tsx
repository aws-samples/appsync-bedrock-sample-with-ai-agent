import { Auth } from "aws-amplify";
import { agentApiEndpoint } from "../endpoints";

export async function Invoke<T> (query: string, variables: any, endpoint: string, authHeaders: any) {

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...authHeaders,
        },
        body: JSON.stringify({
            query,
            variables: variables || {}
        })
    });

    const responseBody = await response.json();

    if (responseBody.errors) {
        throw new Error(responseBody.errors[0].message);
    }

    return responseBody.data as T;
}

export async function InvokeAgentAPI<T> (query: string, variables?: any) { 
    const user = await Auth.currentAuthenticatedUser()
    return Invoke<T>(query, variables, agentApiEndpoint, {
        Authorization: user.signInUserSession.accessToken.jwtToken
    });
}


export class GraphqlQuery<T> {

    constructor(
        public query: string
    ) { }

    invoke(variables : any = {}){
        return InvokeAgentAPI<T>(this.query, variables);
    }   
}

