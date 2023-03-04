import { NETWORKS_IDS } from './Index'

export interface INETWORK_ADDRESSES {
    [key: string]: string;
}

const ETH_MAINNET: INETWORK_ADDRESSES = {
    WETH: '',
    USDT: '',
    USDC: '',
}

const BSC_MAINNET: INETWORK_ADDRESSES = {
    WBNB: '',
    USDT: '',
    USDC: '',
}

const BSC_TESTNET: INETWORK_ADDRESSES = {
    WBNB: '',
    USDT: '',
    USDC: '',
}


export function AddressForChain(NET_ID: number) {
    if (NET_ID === NETWORKS_IDS['ETH_MAINNET']) return ETH_MAINNET
    if (NET_ID === NETWORKS_IDS['BSC_MAINNET']) return BSC_MAINNET
    if (NET_ID === NETWORKS_IDS['BSC_TESTNET']) return BSC_TESTNET
    throw Error(NET_ID + " Is Not Supported");
}