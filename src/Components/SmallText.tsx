import { useLocation } from "react-router-dom"

export default function ({ text }: { text: string }) {
    return <span className="small-text" children={String(text)} />
}