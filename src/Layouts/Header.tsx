import Grid from "@mui/material/Grid";
import Button from '@mui/material/Button'
import { useEthersContext } from "../Contexts/WalletContext";

export default function () {
    const { address, connect, connected } = useEthersContext()

    return (
        <header className="header-main">
            <div className="space-between">
                {/* <Button children='Connect' /> */}
            </div>
            <div className="space-between">
                <Button onClick={connect} variant="contained" children={connected ? 'Connected' : 'Connect'} />
            </div>
        </header>
    )
}