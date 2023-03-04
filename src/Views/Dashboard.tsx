import { Grid, Button } from "@mui/material";
import { TrackChanges, NewReleases, ExpandCircleDown, SwapHoriz } from '@mui/icons-material'
import Pageheadine from "../Components/Pageheadine";
import { useState } from 'react'
import Headline from "../Components/Headline";
import SmallText from "../Components/SmallText";
import BasePairs from "../Components/BasePairs";
import isValidERC20Address from "../Helpers/isValidERC20Address";

export default function () {
    const [tokenAddress, setTokenAddress] = useState('')
    const [isTokenAddressValid, setIsTokenAddressValid] = useState(false)
    const [showBasePairs, setShowBasePairs] = useState(false)
    const [isSnipperOn, setIsSnipperOn] = useState(false)


    const GridOne = (
        <Grid className="none-full-grid">
            <BasePairs shown={showBasePairs} onClose={handleBasePairsListClose} />
            <Headline headline={
                <>
                    <NewReleases />
                    <SmallText text='Snipper Config' />
                </>
            } />

            <div className="grid-col">
                <label className="col-label" htmlFor="">enter token address</label>
                <div className="input-container">
                    <input
                        disabled={isSnipperOn}
                        className={`text-input-el ${isTokenAddressValid ? 'input-success' : 'input-error'}`}
                        value={tokenAddress}
                        onBlur={handleTokenInputFocusOut}
                        onPaste={handleTokenInputFocusOut}
                        onFocus={handleTokenInputFocused}
                        onChange={(a) => handleTokenIputChange(a.target.value)}
                        placeholder="0x0....." />
                </div>
            </div>

            <div className="grid-col">
                <div className="button-container">
                    <Button disabled={isSnipperOn} variant="outlined" onClick={toggleBasePairsModal}>
                        <div className="space-between">
                            <SmallText text='Change Pair' />
                            <ExpandCircleDown />
                        </div>
                    </Button>
                    <Button disabled={isSnipperOn} onClick={toggleBasePairsModal}>
                        <Headline headline='WETH' />
                        <SwapHoriz />
                        <Headline headline='SHIB' />
                    </Button>
                </div>
            </div>

            <div className="grid-col">
                <label className="col-label" htmlFor="">trade amount</label>
                <div className="input-container">
                    <input
                        disabled={isSnipperOn}
                        type='number'
                        className={`text-input-el ${isTokenAddressValid ? 'input-success' : 'input-error'}`}
                        placeholder="ETH 1" />
                </div>

                <div className="sm-txt-input">
                    <div className="space-between">
                        PERCENTAGE SALE TOKEN<input
                            maxLength={3}
                            step={10}
                            min={10}
                            max={100}
                            disabled={isSnipperOn}
                            type={'number'}
                            placeholder="100"
                            value={100}
                            contentEditable />%
                    </div>
                </div>
            </div>

            <div className="grid-col">
                <div className="button-container">
                    <div className="sm-txt-input">
                        <div className="space-between">
                            TP<input disabled={isSnipperOn} type={'number'} placeholder="10" contentEditable />%
                        </div>
                    </div>
                    <div className="sm-txt-input">
                        <div className="space-between">
                            SL<input disabled={isSnipperOn} type={'number'} placeholder="10" contentEditable />%
                        </div>
                    </div>
                    <div className="sm-txt-input">
                        <div className="space-between">
                            DL<input disabled={isSnipperOn} type={'number'} placeholder="10" contentEditable />Min
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid-col">
                <Button
                    className="button-primary"
                    onClick={handleSnipperSwitch}
                    children={isSnipperOn ? 'Pause Snipper' : 'Start Snipper!'}
                    disabled={!isTokenAddressValid}
                />
            </div>

        </Grid>
    )

    const GridCenter = (
        <Grid xl className="center-full-grid">
            <Headline headline={
                <>
                    <TrackChanges />
                    {/* <SmallText text='Snipper Config' /> */}
                </>
            } />

            <div className="snipper-board-dashboard">
                <label className="col-label" htmlFor="">AVAILABLE LIQUIDITY</label>
                <div className="grid-col-dash">
                    <div className="justify-left" data-id='0.00' >
                        <Headline headline='ETH ' />
                    </div>
                    <div className="justify-left" data-id='0.00' >
                        <Headline headline='BUSD' />
                    </div>
                    <div className="justify-left" data-id='123,456,789.00' >
                        <Headline headline='USD ' />
                    </div>
                </div>
                {/*  */}
                <label className="col-label" htmlFor="">PRICE VARIANTS</label>
                <div className="grid-col-dash">
                    <div className="grid-col-display">
                        <label className="col-label" htmlFor="">LAST PRICE</label>
                        <div className="input-container">
                            <Headline headline='394,342,232.34' />
                        </div>
                    </div>
                    <div className="grid-col-display">
                        <label className="col-label" htmlFor="">CURRENT PRICE</label>
                        <div className="input-container">
                            <Headline headline='394,342,232.34' />
                        </div>
                    </div>
                    <div className="grid-col-display">
                        <label className="col-label" htmlFor="">IN POSITION</label>
                        <div className="input-container">
                            <Headline headline='NO<' />
                        </div>
                    </div>
                    <div className="grid-col-display">
                        <label className="col-label" htmlFor="">BUY PRICE</label>
                        <div className="input-container">
                            <Headline headline='394,342,232.34' />
                        </div>
                    </div>
                    <div className="grid-col-display">
                        <label className="col-label" htmlFor="">SALE PRICE</label>
                        <div className="input-container">
                            <Headline headline='394,342,232.34' />
                        </div>
                    </div>
                    <div className="grid-col-display">
                        <label className="col-label" htmlFor="">DIFF FROM LAST BUY</label>
                        <div className="input-container">
                            <Headline headline='394,342,232.34' />
                        </div>
                    </div>
                    <div className="grid-col-display">
                        <label className="col-label" htmlFor="">DIFF FROM LAST BUY</label>
                        <div className="input-container">
                            <Headline headline='394,342,232.34' />
                        </div>
                    </div>
                    <div className="grid-col-display">
                        <label className="col-label" htmlFor="">DIFF FROM LAST BUY</label>
                        <div className="input-container">
                            <Headline headline='34%' />
                        </div>
                    </div>
                </div>


                <div className="grid-col">
                    <div className="space-between">
                        <Button
                            className="button-primary"
                            onClick={handleSnipperSwitch}
                            children={'Buy'}
                        />
                        <Button
                            className="button-primary"
                            onClick={handleSnipperSwitch}
                            children={'Sell!!!'}
                        />
                    </div>
                </div>
            </div >
        </Grid >
    )


    const GridRight = (
        <Grid className="none-full-grid">
            {/* <!-- ADS ONE --> */}
            <ins className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-9643693190346556"
                data-ad-slot="7976580791"
                data-ad-format="auto"
                data-full-width-responsive="true"></ins>
            <script>
                (adsbygoogle = window.adsbygoogle || []).push({ });
            </script>
        </Grid>
    )


    return (
        <Grid className="master-grid">
            <Pageheadine />
            <Grid className="container-grid">
                {GridOne}
                {GridCenter}
                {GridRight}
            </Grid>
        </Grid>
    )



    function handleBasePairsListClose() {
        setShowBasePairs(state => !state)
    }

    function handleTokenInputFocusOut() {
        setIsTokenAddressValid(T => isValidERC20Address(tokenAddress))
    }
    function handleTokenInputFocused() {
        setIsTokenAddressValid(T => isValidERC20Address(tokenAddress))
    }

    function handleTokenIputChange(address: any) {
        setTokenAddress(add => address)
        setIsTokenAddressValid(T => isValidERC20Address(address))
    }

    function toggleBasePairsModal() {
        setShowBasePairs(state => !state)
    }

    function handleSnipperSwitch() {
        setIsSnipperOn(state => !state)
    }
}