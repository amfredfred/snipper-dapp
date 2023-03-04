import { useRef } from "react"
import useTargetIsNotElentAndChildren from "../Hooks/useTargetIsNotElentAndChildren"
import { CurrencyPound, CloseOutlined } from '@mui/icons-material'
import Headline from "./Headline"
import SmallText from "./SmallText"

export default function ({ shown = false, onClose }: { shown: Boolean, onClose?: Function }) {
    const pairsListRef = useRef(null)
    useTargetIsNotElentAndChildren(pairsListRef, onClose)

    function handleSelectedBasePair() {
        typeof onClose === 'function' && onClose()
    }

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
                <ul className="base-pair-ul">
                    <li className="base-pair-li" onClick={handleSelectedBasePair}>
                        <img />
                        <div className="col-el">
                            <h4 children='WETH' />
                            <span children="Wrapper Ethereum" />
                        </div>
                        <Headline headline='0.00' />
                    </li>
                </ul>
            </div>
        )
    return <></>
}