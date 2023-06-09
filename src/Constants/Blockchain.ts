

export enum NETWORKS_IDS {
    AVAX = 43114,
    FANTOM = 250,
    AETH_MAINNET = 42161,
    ETH_MAINNET = 1,
    BSC_TESTNET = 97,
    BSC_MAINNET = 56,
}

export const DEFAULD_NETWORK = Number(NETWORKS_IDS.ETH_MAINNET)

export const AVAILABLE_CHAINS = [
    NETWORKS_IDS.AVAX,
    NETWORKS_IDS.FANTOM,
    NETWORKS_IDS.ETH_MAINNET,
    NETWORKS_IDS.AETH_MAINNET
];

export const BLOCKCHAIN_NETWORKS = {
    [NETWORKS_IDS.BSC_MAINNET]: {

    },

    [NETWORKS_IDS.BSC_TESTNET]: {
        // 0xa4b1F
        chainId: "0x61",
        chainName: "Binance Smart Chain",
        shortName: "BSC",
        rpcUrl: "https://rpc.ankr.com/bsc_testnet_chapel",
        blockExplorerUrls: ["https://testnet.bscscan.com/"],
        nativeCurrency: {
            name: "Ether",
            symbol: "BSC",
            decimals: 18,
        },
        img: 'AethIcon',
    },
    [NETWORKS_IDS.ETH_MAINNET]: {
        // 0xa4b1F
        chainId: "0x61",
        chainName: "Ethereum",
        shortName: "ETH",
        rpcUrl: "https://rpc.ankr.com/eth",
        blockExplorerUrls: ["https://etherscan.io/"],
        nativeCurrency: {
            name: "Ether",
            symbol: "ETH",
            decimals: 18,
        },
        img: 'AethIcon',
    },
}

export const GetNetwork = (id: number) => {
    const BlockChainNetwork = (BLOCKCHAIN_NETWORKS as any)[id]
    if (BlockChainNetwork) return (BLOCKCHAIN_NETWORKS as any)[id]
    throw (`${id } INVALID NETWORK ID PROVIDED!!!`)
}