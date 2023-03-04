import { useLocation } from "react-router-dom"

export default function ({ headline }: {headline:React.ReactNode}) {
    if (Boolean(headline))
        return <h3 className="h3-headline" children={headline} />
    return <></>
}