import { useLocation } from "react-router-dom"

export default function () {
    const path = useLocation()
    return <h2 className="page-headline" children={String(path?.pathname !== '/' ? path?.pathname : 'snipeboard')} />
}