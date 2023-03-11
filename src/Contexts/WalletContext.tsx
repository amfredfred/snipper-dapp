import React, { createContext, useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { AVAILABLE_CHAINS, DEFAULD_NETWORK, GetNetwork, NETWORKS_IDS } from '../Constants/Blockchain';
import { ethers } from 'ethers'
import useStorage from '../Hooks/useStorage';
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';
import { useAddressesForChain } from '../Constants/Index';

type onChainProvider = {
    connect: () => any;
    changeNetwork: (chain: NETWORKS_IDS) => void;
    disConnet: () => void;
    provider: ethers.JsonRpcProvider | null;
    address: string | undefined;
    connected: Boolean;
    chainID: number;
    wallet: ethers.Wallet | null;
    baseToken: string | { [key: string]: string } | any,
    changeBaseToken: (token: string) => void
};

export type Web3ContextData = {
    onChainProvider: onChainProvider;
} | null;

export const EthersContext = React.createContext<Web3ContextData>(null);

export const useEthersContext = () => {
    const ethersContext = useContext(EthersContext);
    if (!ethersContext) {
        throw new Error("useWeb3Context() can only be used inside of <Web3ContextProvider />, " + "please declare it at a higher level.");
    }
    const { onChainProvider } = ethersContext;
    return useMemo(() => {
        return { ...onChainProvider };
    }, [ethersContext]);
}

export default function ({ children }: { children: React.ReactNode }) {
    const [connected, setConnected] = useState(false);
    const [chainID, setChainID] = useState(DEFAULD_NETWORK);
    const [address, setAddress] = useState<string | undefined>("");
    const [wallet, setwallet] = useState<any>(null)
    const [provider, setProvider] = useState<ethers.JsonRpcProvider | null>(null)
    const addresses = useAddressesForChain(chainID)
    const [baseToken, setBaseToken] = useState<string | {}>(addresses['WETH'])
    const { getItemFromLocal, setItemToLocal, removeItemFromLocal } = useStorage()
    const navigate = useNavigate()

    useLayoutEffect(() => {
        const BlockchainNetwrok = GetNetwork(chainID)
        const Provider = new ethers.JsonRpcProvider(BlockchainNetwrok['rpcUrl'])
        const cached = cachedAuth('', 'get', 'auth')
        setProvider(Provider)
        if (Boolean(cached?.address)) {
            setConnected(cached?.connected)
            setChainID(cached?.chainID)
            setAddress(cached?.address)
            setwallet(cached?.wallet)
        }
    }, [chainID, connected])

    const connect = async () => {
        const cachedWallet = await getItemFromLocal('w-a-l-l-e-t')
        if (Boolean(cachedWallet?.private_key)) {
            const myWallet = new ethers.Wallet(cachedWallet?.private_key)
            let CachedIt = {}
            if (myWallet !== null && provider !== undefined) {  
                setwallet(myWallet)
                setAddress(myWallet?.address)
                setConnected(true)
                CachedIt = {
                    wallet: myWallet,
                    address: myWallet?.address,
                    connected: true,
                    chainID: chainID,
                    baseToken: baseToken
                }
            }
            if (AVAILABLE_CHAINS.includes(chainID)) {

            }

            CacheAuth(CachedIt)
        } else {
            toast.warn('No Wallet Detected, Try Generating Or Import!!!')
            setTimeout(() => navigate('account'), 1000)
        }
    }

    const changeNetwork = (id: number) => {
        setChainID(id)
    }

    const disConnet = async () => {
        const cached = await cachedAuth(null, 'get', 'auth')
        console.log(cached)
        cachedAuth({
            ...cached,
            connected: false
        }, 'set', 'auth')
        setConnected(false)
    }

    function CacheAuth(info: any) {
        cachedAuth(info, 'set', 'auth')
    }

    function cachedAuth(info: any, action: 'remove' | 'set' | 'get', key: string) {
        switch (action) {
            case ('remove'):
                if (Boolean(key))
                    return removeItemFromLocal(key)
                break
            case ('set'):
                if (Boolean(key))
                    return setItemToLocal(key, info)
                break
            case ('get'):
                if (Boolean(key))
                    return getItemFromLocal(key)
                break;
        }
    }

    function changeBaseToken(symbol: string) {
        setBaseToken(t => symbol)
    }

    const onChainProvider = useMemo(() => ({
        connect,
        changeNetwork,
        disConnet,
        changeBaseToken,
        provider,
        address,
        connected,
        chainID,
        wallet,
        baseToken,
    }), [wallet, address, chainID])

    return (
        <EthersContext.Provider value={{ onChainProvider }} >
            {children}
        </EthersContext.Provider>
    )
}