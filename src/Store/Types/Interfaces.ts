import { Dispatch } from "react"

export type ElemetnsProps = React.HTMLAttributes<HTMLElement>

export type AccountTs = {
    actions?: 'balance'
    balance?: {
        eth?: number,
        token?: number
        base?: number
    }
}

export const AccountIniTs: AccountTs = {
    balance: {
        eth: 0,
        token: 0,
        base: 0
    }
}

export type BotConfigsTs = {
    actions?: 'token' | 'pair' | 'rate'
    | 'price' | 'eth_amount' | 'loading' | 'snipper'
    | 'takeProfit' | 'stopLoss' | 'deadLine' | 'lastBuy'
    | 'sellPrice' | 'inPosistion' | 'lastSell' | 'token_amount' | 'diffFromLastBuy'
    | 'percentageSale' | 'gasPrice'
    token: {
        balance: string,
        address: string,
        name: string,
        symbol: string,
        decimals: number,
        isValid: boolean
        allowance: number | undefined
    } | any
    pair?: {
        address: string | null
        isValid: boolean
        base: number
        token: number
    }
    rate?: ''
    price?: {
        current?: string,
        last?: string
    }
    takeProfit?: number
    stopLoss?: number
    lastBuy?: number
    lastSell?: number
    sellPrice?: number
    diffFromLastBuy?: number
    inPosistion?: boolean
    deadLine?: number
    eth_amount?: number,
    percentageSale?: number
    token_amount?: number
    loading?: boolean
    gasPrice?: {
        fast: number
        medium: number
        low: number
    }
    snipper?: {
        loading: boolean
        running: boolean
        inPosition: boolean
    }
}

export const BotConfigIniTs: BotConfigsTs = {
    actions: 'token',
    token: {
        balance: '0.00',
        address: null,
        name: null,
        symbol: null,
        decimals: 0,
        allowance: undefined
    },
    loading: false,
    takeProfit: 30,
    stopLoss: 20,
    deadLine: 5,
    eth_amount: 0,
    token_amount: 0,
    percentageSale: 100
}

export type AppTs = {
    account: AccountTs,
    botConfigs: BotConfigsTs
} | any