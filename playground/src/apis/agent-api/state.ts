import { atom } from 'recoil';
import * as TAgentApi from './types'

/*
    Loadable indicates a value can have a loading state
*/
export class Loadable<T> {
    public loading: 'unloaded' | 'loading' | 'loaded'
    public value: T | undefined

    constructor(loading: 'unloaded' | 'loading' | 'loaded', value: T | undefined){
        this.loading = loading
        this.value = value
    }

    public isLoaded(): boolean {
        return this.loading === 'loaded'
    }

    public isUnloaded(): boolean {
        return this.loading === 'unloaded'
    }

    public static unloaded<T>() : Loadable<T>{
        return new Loadable<T>('unloaded', undefined)
    }

    public static loading<T>(): Loadable<T>{
        return new Loadable<T>('loading', undefined)
    }

    public static loaded<T>(value: T): Loadable<T>{
        return new Loadable<T>('loaded', value)
    }
}

/*
    Record Type 
*/

export class ObjRecord<T extends {id: string}> {

    private constructor(private value: Record<string, T>){}

    public static of<T extends {id: string}> (items: T[]) {
        let mapping = {} as Record<string, T>
        for (let item of items) {
            mapping[item.id] = item
        }
        return new ObjRecord(mapping)
    }

    public static empty<T extends {id: string}>() {
        return new ObjRecord<T>({})
    }

    public get(id: string): T {
        return this.value[id] as T
    }

    public items(): T[] {
        return Object.values(this.value)
    }

    public map(fn: (item: T) => any): any[] {
        return Object.values(this.value).map(fn)
    }

    public ids(): string[] {
        return Object.keys(this.value)
    }

    public without(id: string): ObjRecord<T> {
        let all = this.items()
        let without = all.filter(item => item.id !== id)
        return ObjRecord.of(without)
    }
}

type ConversationMessagesStore = Record<string, Loadable<TAgentApi.ConversationEvent[]>>

export const ConversationEvents = atom<ConversationMessagesStore> ({
    key: 'AgentApiEvents',
    default: {},
})

type PartialResultsStore = TAgentApi.ConversationMetadataState

export const ConversationPartialResults = atom<PartialResultsStore>({
    key: 'AgentApiConversationPartialResults',
    default: {
        partialMessage: '',
        responding: false
    },
})

type ConversationStore = Loadable<ObjRecord<TAgentApi.Conversation>>

export const Conversations = atom<ConversationStore>({
    key: 'AgentApiConversations',
    default: Loadable.unloaded(),
})


type AgentStore = Loadable<ObjRecord<TAgentApi.Agent>>

export const Agents = atom<AgentStore>({
    key: 'AgentApiAgents',
    default: Loadable.unloaded(),
})

type ActionStore = Loadable<ObjRecord<TAgentApi.Action>>

export const Actions = atom<ActionStore>({
    key: 'AgentApiActions',
    default: Loadable.unloaded(),
})


