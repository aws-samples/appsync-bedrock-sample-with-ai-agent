import { Card, Flex, Text, View } from "@aws-amplify/ui-react"

interface ConnectionItem {
    type: string
    resource: string
    name: string
}

export function ConnectedItem (props: ConnectionItem) {

    return <Card>
        <Flex>
            <View className='connectedIndicator'/> 
            <Text textTransform='capitalize'>
                {props.name}
            </Text>
        </Flex>
    </Card>
}
