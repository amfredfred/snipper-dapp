import getLocallanguage from "./getLocallanguage"
export default function (num: string | number, lang?: string, currency?: 'EUR' | "USD") {
    const ToNum = Number(num)
    const lLang = getLocallanguage()
    if (typeof ToNum === 'number') {
        const usLang = Boolean(lang) ? lang : lLang
        const Fomarter = new Intl.NumberFormat(usLang,
            { currency: currency })
        return Fomarter.format(ToNum)
    }
    return ToNum
}
