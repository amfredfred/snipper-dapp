import { NETWORKS_IDS } from './Index'

export interface INETWORK_ADDRESSES {
    [key: string]: string | any;
}

const ETH_MAINNET: INETWORK_ADDRESSES = {
    WETH: { 'address': '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', name: 'Ethereum', symbol: 'ETH', decimals: 18 },
    USDT: '',
    USDC: '',
    UNISWAP_ROUTER: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    UNISWAP_FACTORY: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
    ZERO: '0x0000000000000000000000000000000000000000'
}

const BSC_MAINNET: INETWORK_ADDRESSES = {
    WETH: '',
    USDT: '',
    USDC: '',
}

const BSC_TESTNET: INETWORK_ADDRESSES = {
    WETH: { 'address': '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd', name: 'BS Chain', symbol: 'BSC', decimals: 18 },
    USDT: '',
    USDC: '',
}


export function useAddressesForChain(NET_ID: number): INETWORK_ADDRESSES {
    if (NET_ID === NETWORKS_IDS['ETH_MAINNET']) return ETH_MAINNET
    if (NET_ID === NETWORKS_IDS['BSC_MAINNET']) return BSC_MAINNET
    if (NET_ID === NETWORKS_IDS['BSC_TESTNET']) return BSC_TESTNET
    throw Error(NET_ID + " Is Not Supported");
}