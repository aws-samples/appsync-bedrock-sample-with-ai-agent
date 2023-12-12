import * as fs from 'fs'

const rawArtifacts = fs.readFileSync('../cdk-infrastructure/cdk.out/artifacts.json', 'utf-8')
const parsedArtifacts = JSON.parse(rawArtifacts)['AppsyncAgentAPIDemoRepo']

let envVariables = ''

for (const key in parsedArtifacts) {
	envVariables += `REACT_APP_${key.toUpperCase()}=${parsedArtifacts[key]}\n`
}

fs.writeFileSync('./.env.development.local', envVariables)

