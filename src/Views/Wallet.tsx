import { Grid, Button, Dialog } from "@mui/material";
import {
    AccountBalanceWallet,
    DownloadDoneRounded,
    DownloadOutlined,
    UploadOutlined,
    DeleteForever,
    QrCode,
    ShareRounded,
    DownloadRounded,
    CloseRounded
} from '@mui/icons-material'
import Pageheadine from "../Components/Pageheadine";
import useAssets from "../Hooks/useAssets";
import { useRef, useState } from "react";
import { ethers } from 'ethers'
import CopyToClipboard from "../Components/CopyToClipboard";
import Headline from "../Components/Headline";
import SmallText from "../Components/SmallText";
import useStorage from "../Hooks/useStorage";
import { useEthersContext } from "../Contexts/WalletContext";
import { AccountTs, AppTs, BotConfigsTs } from '../Store/Types/Interfaces'
import formartNumToLocal from "../Helpers/formatNumToLocal";
import QRCode from "react-qr-code";
import useTargetIsNotElentAndChildren from "../Hooks/useTargetIsNotElentAndChildren";
import { useBalances } from "../Hooks/useBalances";
import { useSelector, useDispatch } from 'react-redux'
import { Account } from '../Store/Slices/accountSlice'

export default function () {
    const { photos } = useAssets()
    const { address, connect, connected, disConnet, baseToken } = useEthersContext()
    const [shouldGenWallet, setShouldGenWallet] = useState(false)
    const [walletCreated, setWalletCreated] = useState<any>()
    const { setItemToLocal, getItemFromLocal } = useStorage()
    const aStates = useSelector<AppTs, AccountTs>(state => state.account)
    const cStates = useSelector<AppTs, BotConfigsTs>(state => state.snipper)
    const aDispatch = useDispatch()

    const [showWalletInfo, setShowWalletInfo] = useState(false)
    const walletQrRef = useRef(null)
    const { query_my_blalances } = useBalances()
    useTargetIsNotElentAndChildren(walletQrRef, () => setShowWalletInfo(false))
    function handleModalToggle() {
        if (shouldGenWallet) {
            const confirmed = window.confirm('PRESS `OK` IF YOU HAVE BACKED UP YOUR PASSPHRASE?')
            if (confirmed) { }
            else return
        }
        else generateWallet();
        setShouldGenWallet(state => !state)
    }

    function handleAccountInfoUpdate(action: AccountTs['actions'], state: any) {
        aDispatch(Account({ type: action, payload: state }))
    }

    async function generateWallet() {
        const NewWallet = ethers.Wallet.createRandom()
        const wallet = {
            address: NewWallet?.address,
            mnemonic: NewWallet?.mnemonic?.phrase,
            phrase: NewWallet?.mnemonic?.phrase,
            private_key: NewWallet?.privateKey
        }
        setItemToLocal('w-a-l-l-e-t', wallet)
        setWalletCreated(wallet)
        try { connect() }
        catch (error: any) { console.log(error) }
    }

    function saveWalletAsText() {
        const cachedWallet = getItemFromLocal('w-a-l-l-e-t')
        const element = document.createElement("a");
        const file = new Blob([
            'ADDRESS: ' + (walletCreated?.address ?? cachedWallet?.address) + '\n\n',
            'MNEMONIC: ' + (walletCreated?.mnemonic ?? cachedWallet?.phrase) + '\n\n',
            'PRIVATE_KEY: ' + (walletCreated?.private_key ?? cachedWallet?.private_key) + '\n\n'], {
            type: 'text/plain'
        });
        element.href = URL.createObjectURL(file);
        element.download = `${window.location.hostname}-wallet-${new Date().toDateString()}.txt`;
        document.body.appendChild(element);
        element.click();
    }

    const WalletQr = (
        <Dialog open={showWalletInfo} ref={walletQrRef.current}>
            <div className="container" >
                <div className="space-between" style={{ width: '100%' }}>
                    <Headline headline='Funding Wallet' />
                    <CloseRounded onClick={() => setShowWalletInfo(false)} />
                </div>
            </div>
            <div className="qr-container">
                <QRCode value={String(address)} />
                <div className="spae-between">
                    <Headline
                        headline={`Please Send Only ${baseToken['name']} (${baseToken['symbol']}) To This Address!!`}
                    />
                    <br />
                    <SmallText
                        text={`Send enough (${baseToken['symbol']}) to cover all transactions fess!`} />
                    <hr />
                    <div className="space-between">
                        <CopyToClipboard hidden Text={address ?? ''} />
                        <Button >
                            <ShareRounded />
                        </Button>
                        <Button >
                            <DownloadRounded />
                        </Button>
                    </div>
                </div>

            </div>
        </Dialog>
    )

    const WalletInfo = (
        <div className="flex-row bad">
            <Grid className="elevated">
                <Headline headline='' />
                <div className="flex-wrap">
                    <div className="space-between" style={{ gap: 0 }}>
                        <h2 className="balance-headline"
                            data-balance={formartNumToLocal(Number(aStates?.balance?.eth))}
                            children={`${baseToken['symbol']}`} /> |&nbsp;
                        <h2 className="balance-headline"
                            data-balance={formartNumToLocal(Number(aStates?.balance?.base))}
                            children={`BASE`} />
                        {Boolean(cStates?.token?.symbol) && <>|&nbsp;
                            <h2 className="balance-headline"
                                data-balance={formartNumToLocal(Number(cStates?.token?.balance))}
                                children={cStates?.token?.symbol} />
                        </>}
                    </div>
                    <div className="grid-col">
                        <div className="space-between" style={{ flexWrap: 'nowrap' }}>
                            <Button variant="outlined">
                                <Headline headline={`${baseToken['symbol']}`} />
                            </Button>
                            <input
                                disabled={false}
                                type='number'
                                style={{ width: '50%', flexGrow: 1 }}
                                className={`text-input-el ${true ? 'input-success' : 'input-error'}`}
                                placeholder="0.00" />
                        </div>
                        <div className="button-container">
                            <div className="space-between">
                                <Button variant="contained" onClick={() => setShowWalletInfo(true)}>
                                    Add Fund`(s)&nbsp;&nbsp; <DownloadOutlined />
                                </Button>
                                <Button variant="contained">
                                    Withdraw Fund`(s)&nbsp;&nbsp;<UploadOutlined />
                                </Button>
                                <Button variant="contained"
                                    className={Boolean(address) ? 'danger-button' : ''}
                                    onClick={connected ? disConnet : () => { }} >
                                    Remove Account&nbsp;&nbsp;<DeleteForever />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Grid>
            <div className="grid-col">
                <Headline headline={
                    <>
                        <div className='space-between' style={{ marginTop: '1rem' }}>
                            <AccountBalanceWallet />
                            <SmallText text='Wallet info' />
                        </div>
                    </>
                } />
                <div className="space-between">
                    <CopyToClipboard Text={address ?? ''} />
                    <Button
                        className="button-primary"
                        onClick={saveWalletAsText}
                        children={'Download Wallet Info.'}
                    />
                </div>
            </div>
        </div>
    )

    const GuestMessgae = (
        <div className="flex-row" style={{ background: 'transparent' }}>
            <Pageheadine />
            {
                connected ?
                    <p className="explainer-short">
                        <Headline headline='WELCOME BACK' />
                    </p>
                    :
                    <p className="explainer-short">
                        To use the snipping bot, <br />
                        you are expected to create a virtaul wallet on our platform,<br />
                        to ensure safety and will help snipper to work effeciently...
                        <a href="#" className="learn-more-link">Learn more</a>
                    </p>
            }
            <Grid className="container-grid">
                <div className="space-between">
                    <Button variant="contained"
                        className={connected ? 'danger-button' : ''}
                        onClick={connected ? disConnet : Boolean(address) ? connect : handleModalToggle}
                    >
                        {connected ? 'Disconnect' : Boolean(address) ? 'Re-Connect' : 'GENERATE WALLET '} <AccountBalanceWallet />
                    </Button>
                    <Button variant="contained">
                        IMPORT WALLET&nbsp;&nbsp;<DownloadDoneRounded />
                    </Button>
                </div>
            </Grid>

        </div>
    )

    return (
        <Grid className="master-grid">
            <div className="flexed-bg" style={{ backgroundImage: `url(${photos.codeOne})` }} />
            <div className="flex-wrap ">
                {GuestMessgae}
                {connected ? WalletInfo : ''}
                {WalletQr}
            </div>
        </Grid>
    )
}