import { Grid, Button } from "@mui/material";
import { Bolt, } from '@mui/icons-material'
import Pageheadine from "../Components/Pageheadine";

export default function () {
    return (
        <Grid className="master-grid">
            <Pageheadine />
            <p className="explainer-short">
                To use the snipping bot, <br />
                you are expected to create a virtaul wallet on our platform,<br />
                to ensure safety and will help snipper to work effeciently...
                <a href="#" className="learn-more-link">Learn more</a>
            </p>

            <Grid className="container-grid">
                <Button variant="contained">
                    GENERATE MY WALLET
                </Button>
            </Grid>
        </Grid>
    )
}