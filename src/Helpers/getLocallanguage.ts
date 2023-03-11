export default function () {
    return (window.navigator as any)?.userLanguage || window.navigator.language
}