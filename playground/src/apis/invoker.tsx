import { Auth } from "aws-amplify";
import { agentApiEndpoint } from "../endpoints";

/*
* Invokes Agent API Function using GraphQL
* */

export async function Invoke<T> (query: string, variables: any, endpoint: string, authHeaders: any) {

    const response = await fetch(endpoint, { //endpoint is a URL
        method: 'POST', //make POST Request to GraphQL endpoint
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...authHeaders,
        },
        body: JSON.stringify({
            query, //String - GraphQL query/mutation
            variables: variables || {} //optional variables
        })
    });

    //call API
    const responseBody = await response.json();

    //throw any errors
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

    //makes requests, uses JWT token from session in Authorization header
    invoke(variables : any = {}){
        return InvokeAgentAPI<T>(this.query, variables);
    }   
}

