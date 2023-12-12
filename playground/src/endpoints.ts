export const agentApiEndpoint = process.env.REACT_APP_AGENTAPIENDPOINT as string

export const cognitoConfig = {
	region: process.env.REACT_APP_REGION as string,
	userPoolId: process.env.REACT_APP_COGNITOPOOL as string,
	userPoolWebClientId: process.env.REACT_APP_COGNITOCLIENT as string,
}

export const fmHandlerArns = [
	{
		label: 'simple',
		name: process.env.REACT_APP_HANDLERCLAUDESIMPLE,
	},
	{
		label: 'websocket',
		name: process.env.REACT_APP_HANDLERCLAUDEWEBSOCKET,
	},
	{
		label: 'agent',
		name: process.env.REACT_APP_HANDLERCLAUDEAGENT,
	}	
]


export const appsyncActionOutputs = [
	{
		label: 'car-dealership',
		endpoint: process.env.REACT_APP_CARDEALERAPI,
	},
]

export const enableConfigureAgents = process.env.REACT_APP_ENABLECONSTRUCTINGAGENTS === 'true'