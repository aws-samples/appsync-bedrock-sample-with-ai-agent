import { BatchWriteItemCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { readFileSync } from 'fs';

const cdkOutputs = JSON.parse(readFileSync('./cdk.out/artifacts.json', 'utf8'))['AppsyncAgentAPIDemoRepo']
const dynamoDB = new DynamoDBClient({ region: cdkOutputs['Region'] })
const docClient = DynamoDBDocumentClient.from(dynamoDB);

async function DumpIntoTable(tableName, fileName, env = {}){

    let rawFile = readFileSync('./scripts/' + fileName + '.json', 'utf-8')
    for (let key of Object.keys(env)){
        rawFile = rawFile.replaceAll(key, env[key])
    }

    let jsonData = JSON.parse(rawFile);
    let chunkSize = 20;
    let chunks = jsonData.length / chunkSize;

    for (let i = 0; i < chunks; i++) {
        let chunk = jsonData.slice(i * chunkSize, (i + 1) * chunkSize);
        let params = {
            RequestItems: {
                [tableName]: chunk.map(item => ({ PutRequest: { Item: item } }))
            }
        };
        console.log(`Writing ${chunk.length} items to table ${tableName} for sample playground`)
        await docClient.send(new BatchWriteItemCommand(params));
    }
}

// Write some sample data to the tables we created
DumpIntoTable(cdkOutputs['dealershiptable'], 'sample-cars');
DumpIntoTable(cdkOutputs['agentstable'], 'sample-agents', {
    '$HANDLERSIMPLE' : cdkOutputs['handlerclaudesimple'],
    '$HANDLERWEBSOCKET' : cdkOutputs['handlerclaudewebsocket'],
    '$HANDLERAGENT': cdkOutputs['handlerclaudeagent']
});
DumpIntoTable(cdkOutputs['conversationstable'], 'sample-conversations'); 
DumpIntoTable(cdkOutputs['actionstable'], 'sample-actions', {
    '$SAMPLEAPI': cdkOutputs['cardealerapi']
})
