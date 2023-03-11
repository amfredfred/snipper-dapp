import React, { createContext, useContext } from 'react'
import { useEthersContext } from './WalletContext';
import { ethers } from 'ethers'
import * as abi from '../Constants/Abis'
import { useAddressesForChain } from '../Constants/Addresses';
import useStorage from '../Hooks/useStorage';

type IContractsData = {
    Contracts: {
        ERC20Token: (address?: string) => any;
        UniRouter: any;
        UniFactory: any;
    }
} | any

export const ContratcsContext = createContext<IContractsData>(null);

export default function ({ children }: { children: React.ReactNode }) {
    const { provider, wallet, connected, connect, disConnet, address, chainID } = useEthersContext()
    const ADRESSES = useAddressesForChain(chainID)
    const { getItemFromLocal } = useStorage()
    if (!provider) return <>{children}</>

    const signer = () => {
        const wEallet = getItemFromLocal('w-a-l-l-e-t')
        const myWallet = new ethers.Wallet(wEallet?.private_key)
        const signer = myWallet?.connect(provider)
        return signer
    }

    const ERC20Token = (TA: string = ADRESSES['WETH']['address']) => (new ethers.Contract(TA, abi.ERC20ABI, provider).connect(signer()))
    const UniRouter = new ethers.Contract(ADRESSES?.['UNISWAP_ROUTER'], abi.UniswapRouterAbi, provider).connect(signer())
    const UniFactory = new ethers.Contract(ADRESSES?.['UNISWAP_FACTORY'], abi.UniswapFactory, provider).connect(signer())

    const Contracts = {
        ERC20Token,
        UniRouter,
        UniFactory
    }

    return (
        <ContratcsContext.Provider value={{ Contracts }}>
            {children}
        </ContratcsContext.Provider>
    )
}

export function useContractsContext() {
    const Contracts = useContext(ContratcsContext)
    return { ...Contracts?.Contracts }
}
