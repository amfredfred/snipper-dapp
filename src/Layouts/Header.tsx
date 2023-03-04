import Grid from "@mui/material/Grid";
import Button from '@mui/material/Button'

export default function () {
    return (
        <header className="header-main">
            <div className="space-between">
                {/* <Button children='Connect' /> */}
            </div>
            <div className="space-between">
                <Button variant="contained" children='Connect' />
            </div>
        </header>
    )
}