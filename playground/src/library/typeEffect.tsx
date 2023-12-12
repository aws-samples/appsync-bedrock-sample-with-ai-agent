import { useEffect, useMemo, useState } from "react"

interface TypingEffectProps {
    text: String
    startTime: number
}
export function TypingEffect (props: TypingEffectProps) {

    const initialTime = useMemo(() => Date.now(),[])
    const initialTargetLength = (initialTime - props.startTime)/5
    const [length, setLength] = useState(initialTargetLength)

    useEffect(() => {

        if (initialTargetLength === props.text.length) {
            return
        }
        
        let timeDelay = Math.max(0, props.startTime - initialTime)
        let timer: any = undefined;

        setTimeout(() => {
            timer = setInterval(() => {
                setLength(l => {
                    if (l >= props.text.length) {
                        clearInterval(timer)
                        return props.text.length
                    }
                    return Math.max(l, 0) + 8
                })
            }, 40)
        }, timeDelay)        
        
        return () => {
            try {
                setLength(props.text.length)
                clearInterval(timer)
            } catch (e) {}
        }
    }, [initialTargetLength, initialTime, props.startTime, props.text])

    return (
        <span>{props.text.substring(0, length)}</span>
    )
}