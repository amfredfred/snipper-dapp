import { Grid, Button } from "@mui/material";
import { ExpandCircleDown, SwapHoriz, AccountBalanceWallet, NewReleases, SpeedOutlined } from '@mui/icons-material'
import Pageheadine from "../Components/Pageheadine";
import { useEffect, useState } from 'react'
import Headline from "../Components/Headline";
import SmallText from "../Components/SmallText";
import BasePairs from "../Components/BasePairs";
import isValidERC20Address from "../Helpers/isValidERC20Address";
import { motion } from "framer-motion"
import { useEthersContext } from "../Contexts/WalletContext";
import { AccountTs, BotConfigsTs, AppTs } from "../Store/Types/Interfaces";
import { useContractsContext } from "../Contexts/ContractsContext";
import * as NP from '../Helpers/nPoint'
import Loading from "../Components/Loading";
import { toast } from 'react-toastify'
import { useAddressesForChain } from "../Constants/Addresses";
import formatNumToLocal from "../Helpers/formatNumToLocal";
import { useSelector, useDispatch } from 'react-redux'
import { snipperConfig } from "../Store/Slices/snipperSlice";
import useDimensions from "../Hooks/useDimensions";
import { useBalances } from "../Hooks/useBalances";
import { Account } from '../Store/Slices/accountSlice'

export default function () {
    const [showBasePairs, setShowBasePairs] = useState(false)
    const cState = useSelector<AppTs, BotConfigsTs>(state => state.snipper)
    const aState = useSelector<AppTs, AccountTs>(state => state.account)
    const cDispatch = useDispatch()
    const aDispatch = useDispatch()
    const { innerWidth } = useDimensions()
    const { baseToken, address, provider, chainID } = useEthersContext()
    const { UniFactory, UniRouter, ERC20Token } = useContractsContext()
    const ADDRESSES = useAddressesForChain(chainID)
    useBalances()

    const ChosePairVariant = {
        show: { opacity: 1, y: 0, display: 'flex' },
        hide: { opacity: 0, y: -10, display: 'none' }
    }

    function handleConfigUpdate(action: BotConfigsTs['actions'], state: any) {
        cDispatch(snipperConfig({ type: action, payload: state }))
    }

    function handleAccountInfoUpdate(action: AccountTs['actions'], state: any) {
        aDispatch(Account({ type: action, payload: state }))
    }

    async function query_my_blalances() {
        const [ETH, Base, token] = await Promise.allSettled([
            provider?.getBalance(address ?? ''),
            ERC20Token(baseToken['address']).balanceOf(address),
            ERC20Token(cState?.token?.address).balanceOf(address)
        ])
        const bal = {
            ...(aState as any)?.balance,
            eth: formatNumToLocal(NP.from_wei((ETH as any)?.value)),
            base: formatNumToLocal(NP.from_wei((Base as any)?.value, baseToken['decimals'])),
            token: formatNumToLocal(NP.from_wei((token as any)?.value, cState?.token?.decimals))
        }
        handleAccountInfoUpdate('balance', bal)
        return bal
    }

    async function chain_gas_price() {
        // const gasPrice = await (provider as any)?.getFeeData()
        // return gasPrice
    }

    async function find_pair(token?: string, decimals?: number) {
        const TOAST_ID = 'TOAST_ID'
        const pair = await UniFactory.getPair(baseToken['address'], (token ?? cState?.token?.address))
        if (isValidERC20Address(pair)) handleConfigUpdate('pair', pair)
        else { toast.warn(`${pair} is not  a valid pair address!!`) }
        handleConfigUpdate('pair', { ...(cState as any)?.pair, isValid: false, address: null })
        if (pair !== ADDRESSES['ZERO']) {
            toast.success('Prefetch Successful!!', { toastId: TOAST_ID })
            handleConfigUpdate('pair', { ...(cState as any)?.pair, isValid: true, address: pair })
            await get_liquididities_in_pair(pair)
            if (!Boolean(cState?.token?.allowance))
                await approve_tokens_for_router(token ?? cState?.token?.address)
            await get_amount_out(
                (token ?? cState?.token?.address),
                Number(decimals ?? 18),
                baseToken['address'],
            )
            return pair
        }
        toast.error('Someting Went Wrong!!!')
        toast.warn(pair + ': Is not a valid pair address...')
        return 'false'
    }

    async function get_amount_out(from: string, fromDecimal: number, to: string, amIn?: string) {
        const [output, gasPrice] = await Promise.allSettled([
            UniRouter.getAmountsOut(NP.to_wei((amIn ?? '1'), fromDecimal), [from, to]),
            chain_gas_price()
        ])
        if ((output as any)?.status?.rejected) {
            toast.warn('Could Not Fetch Price!!!')
            return
        }
        let amountOut = NP.fromExponential(NP.from_wei((output as any)?.value[1], baseToken['decimals']))
        handleConfigUpdate('price', {
            current: amountOut,
            last: '0.00',
        })
        const DiffFromLastBuy = handlePriceDifference(amountOut)
        handleConfigUpdate('rate', amountOut)
        return amountOut
    }

    async function get_liquididities_in_pair(pair: string) {
        const [token, ETH] = await Promise.allSettled([
            ERC20Token(cState?.token?.address).balanceOf(pair),
            ERC20Token(baseToken['address']).balanceOf(pair)
        ])
        handleConfigUpdate('pair', {
            ...(cState as any)?.pair,
            base: Number(NP.from_wei((ETH as any)?.value, baseToken['decimals'] ?? 18)),
            token: Number(NP.from_wei((token as any)?.value, cState?.token?.decimals ?? 18))
        })
        return true
    }

    async function approve_tokens_for_router(token: string) {
        try {
            const approved = ERC20Token(token).approve(ADDRESSES['UNISWAP_ROUTER'], '1000000000000000000000000000000000000000000000')
            toast.promise(approved, {
                pending: 'Approving Tokens 😌',
                success: 'Approved !!!👌',
                error: 'Tokens Not Approved 🤯'
            })
            await approved
        } catch (err) {
            const ERROR = JSON.parse(JSON.stringify(err))['code']
            toast.warn(ERROR)
        }
    }

    function handleBasePairsListClose() {
        setShowBasePairs(state => !state)
    }

    function handleTokenIputChange(address: any) {
        handleConfigUpdate('pair', { ...(cState as any)?.pair, isValid: false, address: null })
        handleConfigUpdate('token', {
            ...(cState as any)?.token,
            address: address,
            isValid: isValidERC20Address(address)
        })
    }

    function toggleBasePairsModal() {
        setShowBasePairs(state => !state)
    }

    function handleSnipperSwitch() {
        handleConfigUpdate('snipper', { ...(cState as any), running: !cState?.snipper?.running })
    }

    useEffect(() => {
        let notBusy = true
        const interval = setInterval(async () => {
            if (notBusy) {
                notBusy = false
                if (cState?.snipper?.running) {
                    try {

                        const [amounts] = await Promise.allSettled([
                            await get_amount_out(
                                (cState?.token?.address ?? ''),
                                Number(cState?.token?.decimals ?? 18),
                                baseToken['address'],
                            )
                        ])
                        notBusy = true
                    } catch (error) {
                        notBusy = true
                    }

                }
            }
        }, 2000)
        return () => clearInterval(interval)
    }, [cState?.snipper?.running])


    useEffect(() => {
        if (cState?.token?.isValid && !cState?.pair?.isValid)
            (async () => {
                handleConfigUpdate('loading', true)
                const [allowance, name, balance, symbol, decimals] = await Promise.allSettled([
                    ERC20Token(cState?.token?.address).allowance(address, ADDRESSES['UNISWAP_ROUTER']),
                    ERC20Token(cState?.token?.address).name(),
                    ERC20Token(cState?.token?.address).balanceOf(address),
                    ERC20Token(cState?.token?.address).symbol(),
                    ERC20Token(cState?.token?.address).decimals(),
                ])
                handleConfigUpdate('token', {
                    ...(cState as any)?.token,
                    allowance: Number((allowance as any)?.value),
                    address: cState?.token?.address,
                    name: String((name as any)?.value),
                    symbol: String((symbol as any)?.value),
                    decimals: String((decimals as any)?.value),
                    balance: NP.from_wei((balance as any)?.value, 9)
                })
                await find_pair(cState?.token?.address, (decimals as any)?.value)
                await query_my_blalances()
                handleConfigUpdate('loading', false)
            })();
    }, [cState?.token?.isValid, cState?.token?.address, cState?.pair?.isValid, cState?.snipper?.running])

    function handlePriceDifference(newPrice?: number) {
        const lastBuy = Math.random() //cState?.lastBuy
        if (Boolean(cState?.lastBuy)) {
            const DiffFromLastBuy = NP.difference({ o: Number(cState?.lastBuy), n: Number(newPrice) + lastBuy })
            handleConfigUpdate('diffFromLastBuy', DiffFromLastBuy)
        }
    }

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
                <div className="input-container">
                    {/* <label className="col-label" htmlFor="">enter token address</label> */}
                    <div className="space-between" style={{ margin: 0 }}>
                        <input
                            disabled={cState?.snipper?.running}
                            className={`text-input-el ${cState?.token?.isValid ? 'input-success' : 'input-error'}`}
                            value={cState?.token?.address}
                            onChange={(a) => handleTokenIputChange(a.target.value)}
                            onContextMenu={async () => handleTokenIputChange(await navigator.clipboard.readText())}
                            placeholder="0x0..... Token Address" />
                        <Button
                            disabled={cState?.snipper?.running}
                            onClick={async () => handleTokenIputChange(await navigator.clipboard.readText())}
                            children={'PASTE'} />
                    </div>
                </div>
            </div>
            {
                Boolean(cState?.loading) ? <Loading /> : (
                    <motion.div
                        className="grid-col"
                        animate={cState?.token?.isValid && cState?.pair?.isValid ? 'show' : 'hide'}
                        variants={ChosePairVariant}
                    >
                        <div className="button-container">
                            <Button disabled={cState?.snipper?.running} variant="outlined" onClick={toggleBasePairsModal}>
                                <div className="space-between">
                                    <div className="space-between">
                                        <SmallText text='Change' />
                                        <ExpandCircleDown />
                                    </div>
                                    <Headline headline={baseToken?.symbol} />
                                    <SwapHoriz />
                                    <Headline headline={cState?.token?.symbol ?? cState?.token?.name} />
                                </div>
                            </Button>
                        </div>
                    </motion.div>
                )
            }

            <div className="grid-col">
                <div className="input-container">
                    <label className="col-label" htmlFor="">trade amount</label>
                    <div className="space-between" >
                        <input
                            disabled={cState?.snipper?.running}
                            value={cState?.eth_amount}
                            type='number'
                            className={`text-input-el ${cState?.token?.isValid ? 'input-success' : 'input-error'}`}
                            placeholder="ETH 1"
                            onChange={(e: any) => handleConfigUpdate('eth_amount', e.target.value)}
                        />
                        <div className="space-between" style={{ gap: 0 }}>
                            <Button disabled={cState?.snipper?.running} children={'%25'} />
                            <Button disabled={cState?.snipper?.running} children={'%50'} />
                            <Button disabled={cState?.snipper?.running} children={'%100'} />
                        </div>
                    </div>
                </div>

                <div className="sm-txt-input">
                    <div className="space-between">
                        PERCENTAGE TOKEN %<input
                            maxLength={3}
                            step={10}
                            min={10}
                            max={100}
                            disabled={cState?.snipper?.running}
                            type={'number'}
                            onChange={(e: any) => handleConfigUpdate('percentageSale', Number(e?.target?.value))}
                            placeholder="100"
                            value={cState?.percentageSale}
                            contentEditable />
                    </div>
                </div>
            </div>

            <div className="grid-col">
                <div className="button-container">
                    <div className="sm-txt-input">
                        <div className="space-between" title="Coming Soon">
                            TP %<input
                                disabled={true} type={'number'}
                                onChange={(e: any) => handleConfigUpdate('takeProfit', e.target.value)}
                                onBlur={() => {
                                    if (Number(cState?.takeProfit) <= 0)
                                        handleConfigUpdate('takeProfit', 30)
                                }}
                                placeholder={String(cState?.takeProfit)}
                                value={cState?.takeProfit} />
                        </div>
                    </div>
                    <div className="sm-txt-input">
                        <div className="space-between" title="Coming Soon">
                            SL -%<input
                                disabled={true} type={'number'}
                                placeholder={String(cState?.stopLoss)}
                                value={cState?.stopLoss}
                                onBlur={() => {
                                    if (Number(cState?.stopLoss) <= 1)
                                        handleConfigUpdate('stopLoss', 50)
                                }}
                                onChange={(e: any) => handleConfigUpdate('stopLoss', e.target.value)} />
                        </div>
                    </div>
                    <div className="sm-txt-input">
                        <div className="space-between">
                            DL<input
                                disabled={cState?.snipper?.running}
                                type={'number'}
                                placeholder={String(cState?.deadLine)}
                                value={cState?.deadLine}
                                onBlur={() => {
                                    if (Number(cState?.deadLine) <= 0.4)
                                        handleConfigUpdate('deadLine', 6)
                                }}
                                onChange={(e: any) => handleConfigUpdate('deadLine', e.target.value)} />Min
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid-col">
                <Button
                    className={`button-primary ${cState?.snipper?.running ? 'danger-button' : ''}`}
                    onClick={handleSnipperSwitch}
                    children={cState?.snipper?.running ? 'Pause Snipper' : 'Start Snipper!'}
                    disabled={!cState?.token?.isValid}
                />
            </div>

        </Grid>
    )

    const GridCenter = (
        <Grid className="center-full-grid">
            <div className="snipper-board-dashboard">
                <div className="space-between" style={{ width: '100%' }}>
                    <label className="col-label" htmlFor="">AVAILABLE LIQUIDITY</label>
                    <div className="space-between">
                        <SpeedOutlined />
                        <SmallText text="100" />
                    </div>
                </div>
                <div className="grid-col-dash">
                    <div className="justify-left" data-id={formatNumToLocal(String(cState?.pair?.base ?? '0.00'))} >
                        <Headline headline={baseToken['symbol']} />
                    </div>
                    <div className="justify-left" data-id={formatNumToLocal(String(cState?.pair?.token ?? '0.00'))} >
                        <Headline headline={cState?.token?.symbol ?? cState?.token?.name ?? 'Token'} />
                    </div>
                    {/* <div className="justify-left" data-id='--- ---' >
                        <Headline headline='USD ' />
                    </div> */}
                </div>
                <Headline headline={
                    <div className="space-between">
                        <AccountBalanceWallet />
                        <span>
                            {baseToken['symbol']} &nbsp;
                            {formatNumToLocal(aState?.balance?.base ?? '0.00')}
                        </span>
                        &bull;
                        <span>
                            {cState?.token?.symbol ?? cState?.token?.name ?? 'Token'}&nbsp;
                            {formatNumToLocal(aState?.balance?.token ?? '0.00')}
                        </span>
                    </div>
                } />
                {/*  */}
                <label className="col-label" htmlFor="">PRICE VARIANTS</label>
                <div className="grid-col-dash">
                    <div className="grid-col-display">
                        <label className="col-label" htmlFor="">LAST PRICE</label>
                        <div className="input-container">
                            <Headline headline={String(cState?.price?.last ?? '0.000')} />
                        </div>
                    </div>
                    <div className="grid-col-display">
                        <label className="col-label" htmlFor="">CURRENT PRICE</label>
                        <div className="input-container">
                            <Headline headline={String(cState?.price?.current ?? '0.000')} />
                        </div>
                    </div>
                    <div className="grid-col-display">
                        <label className="col-label" htmlFor="">IN POSITION</label>
                        <div className="input-container">
                            <Headline headline={cState?.snipper?.inPosition ? 'Yes 😊' : 'No 😒'} />
                        </div>
                    </div>
                    <div className="grid-col-display">
                        <label className="col-label" htmlFor="">LAST BUY PRICE</label>
                        <div className="input-container">
                            <Headline headline={cState?.lastBuy ?? '0.00'} />
                        </div>
                    </div>
                    <div className="grid-col-display">
                        <label className="col-label" htmlFor="">SALE PRICE</label>
                        <div className="input-container">
                            <Headline headline={cState?.sellPrice ?? '0.00'} />
                        </div>
                    </div>
                    <div className="grid-col-display">
                        <label className="col-label" htmlFor="">DIFF FROM LAST BUY</label>
                        <div className="input-container">
                            <Headline headline={
                                <span style={{ color: String(-34).indexOf('-') ? 'red' : 'green' }}>
                                    {`%${cState?.diffFromLastBuy ?? '0.00'}`}
                                </span>
                            } />
                        </div>
                    </div>
                </div>


                <div className="grid-col">
                    <div className="space-between">
                        <Button
                            className="button-primary"
                            onClick={async () => await swap_eth_for_token('0')}
                            children={'Buy'}
                        />
                        <Button
                            className="button-primary"
                            onClick={async () => swap_token_for_eth('0')}
                            children={'Sell!!!'}
                        />
                    </div>
                </div>
            </div>
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
                {innerWidth > 1200 && (GridOne)}
                {innerWidth <= 1200 && (GridOne)}
                {innerWidth <= 1200 && (GridRight)}
                {(GridCenter)}
                {innerWidth > 1200 && (GridRight)}
            </Grid>
        </Grid>
    )

    async function swap_token_for_eth(minOut: string = '0') {
        const ERROID = 'ETH_TOKEN_ERROR'
        let timeout = Math.floor(Date.now() / 1000) + (Number(cState?.deadLine) * 60)
        if (!Boolean(timeout)) return toast.warning(`Invalid Timeout ${timeout}`)
        const tokens = String((Number(1000) / 100) * Number(cState?.percentageSale))
        console.log(tokens)
        const [swap] = await Promise.allSettled([
            UniRouter.swapExactTokensForETHSupportingFeeOnTransferTokens(
                NP.to_wei(String(cState?.token_amount), Number(cState?.token?.decimals)),
                String(minOut),
                [cState?.token?.address, baseToken['address']],
                address,
                timeout,
                { value: NP.to_wei(String(cState?.token_amount), Number(cState?.token?.decimals)) }
            )
        ])
        if (swap.status === 'fulfilled') {
            handleConfigUpdate('inPosistion', true)
            handleConfigUpdate('lastSell', cState?.price?.current)
            toast.success(`Sold 👌 ${cState?.token?.symbol} ${String(cState?.token_amount)} For ${minOut} 
            ' ' ${(cState?.token?.name ?? cState?.token?.symbol)}
            `)
        }
        const ERR = JSON.parse(JSON.stringify(swap))['reason']
        if ((ERR as any)?.['info']['error']['message'])
            return toast.warn((ERR as any)?.['info']['error']['message'], { toastId: ERROID })
        if (!ERR)
            return toast.error('Something went wrong!!!', { toastId: ERROID })
        toast.error(`${ERR['code']}`, { 'toastId': ERROID })
        if (ERR === 'INSUFFICIENT_FUNDS')
            toast.warn(`${baseToken['symbol'] + ' BALANCE ' + formatNumToLocal(String(aState?.balance?.base))}`)
    }

    async function swap_eth_for_token(minOut: string = '0') {
        const ERROID = 'ETH_TOKEN_ERROR'
        let timeout = Math.floor(Date.now() / 1000) + (Number(cState?.deadLine) * 60)
        if (!Boolean(timeout))
            return toast.warning(`Invalid Timeout ${timeout}`, { 'toastId': ERROID })
        if (!Boolean(cState?.eth_amount))
            return toast.error(`${baseToken['name']} Amount is ${cState?.eth_amount}`, { 'toastId': ERROID })
        const [swap] = await Promise.allSettled([
            UniRouter.swapExactETHForTokensSupportingFeeOnTransferTokens(
                String(minOut),
                [baseToken['address'], cState?.token?.address],
                address,
                timeout,
                { value: NP.to_wei(String(cState?.eth_amount), baseToken['decimals']) }
            )
        ])
        if (swap.status === 'fulfilled') {
            handleConfigUpdate('inPosistion', true)
            handleConfigUpdate('lastBuy', cState?.price?.current)
            toast.success(`Bought 👌 ${minOut} ${(cState?.token?.name ?? cState?.token?.symbol)}`)
        }
        const ERR = JSON.parse(JSON.stringify(swap))['reason']['code']
        toast.error(`${ERR}`, { 'toastId': ERROID })
        if (ERR === 'INSUFFICIENT_FUNDS')
            toast.warn(`${baseToken['symbol'] + ' BALANCE ' + formatNumToLocal(String(aState?.balance?.base))}`)
    }

    function take_fees() {

    }

}