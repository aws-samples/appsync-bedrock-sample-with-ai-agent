import { Card, Divider, Flex, Heading, View } from "@aws-amplify/ui-react";

interface ContainerProps {
    heading: string
    actionBox?: JSX.Element
    minHeight?: number
    children?: any
    padBody?: number
}

export function Container (props: ContainerProps) { 
    return (
        <Card variation="elevated" padding={'0px'} marginBlock={10} minHeight={props.minHeight}>
            <Flex dir='row' padding={10} >
                <Heading>
                    {props.heading}
                </Heading>
                {
                    props.actionBox ? props.actionBox : null
                }
            </Flex>
            <Divider/>
            <View padding={props.padBody ?? 10}>
                {props.children}
            </View>
        </Card>
    )
}