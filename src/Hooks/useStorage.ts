export default function useStorage() {
    function setItemToLocal(key: string, item: any) {
        const ITEM = JSON.stringify(item)
        return localStorage.setItem(key, ITEM)
    }

    function getItemFromLocal(key: string) {
        const ITEM = localStorage.getItem(key)
        if (ITEM !== null) {
            return JSON.parse(ITEM)
        }
        return ITEM;
    }

    function removeItemFromLocal(key: string) {
        return localStorage.removeItem(key)
    }

    return { getItemFromLocal, setItemToLocal, removeItemFromLocal }
}