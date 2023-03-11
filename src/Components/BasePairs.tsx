import { useEffect, useRef } from "react"
import useTargetIsNotElentAndChildren from "../Hooks/useTargetIsNotElentAndChildren"
import { CurrencyPound, CloseOutlined } from '@mui/icons-material'
import Headline from "./Headline"
import SmallText from "./SmallText"
import { useContractsContext } from "../Contexts/ContractsContext"
import { useEthersContext } from "../Contexts/WalletContext"
import { useAddressesForChain } from "../Constants/Index"
import * as abi from '../Constants/Abis'
import { ethers } from 'ethers'

export default function ({ shown = false, onClose }: { shown: Boolean, onClose?: Function }) {
    const { } = useContractsContext()
    const { chainID, address, provider, baseToken } = useEthersContext()
    const ADDRESSES = useAddressesForChain(chainID)
    const pairsListRef = useRef(null)
    useTargetIsNotElentAndChildren(pairsListRef, onClose)

    function handleSelectedBasePair() {
        typeof onClose === 'function' && onClose()
    }

    // const ERC20TOken = (token: string) => new ethers.Contract(token, abi.ERC20ABI, provider)

    // const Balances = () => baseToken && Promise.allSettled([
    //     provider?.getBalance(address ?? ''),
    //     ERC20TOken(baseToken['address']).balanceOf(address)
    // ])

    // useEffect(() => {
    //     console.log(baseToken, address);
    //     (async () => console.log(await Balances()))();
    // }, [])

    if (shown)
        return (
            <div ref={pairsListRef} className="base-pair-wrapper">
                <div className="space-between" style={{ paddingInline: '.6rem' }}>
                    <Headline headline={
                        <>
                            <CurrencyPound />
                            <SmallText text='Pair Currency' />
                        </>
                    } />
                    <CloseOutlined onClick={() => { typeof onClose === 'function' && onClose() }} />
                </div>
                <ul className="base-pair-ul" >
                    <li className="base-pair-li" onClick={handleSelectedBasePair}>
                        <img />
                        <div className="col-el">
                            <h4 children='WETH' />
                            <span children="Wrapper Ethereum" />
                        </div>
                        <Headline headline='0.00' />
                    </li>
                    <div style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Headline headline='COMING SOON ' />
                    </div>
                </ul>
            </div>
        )
    return <></>
}