import { useEffect } from 'react'

export default function (ref: React.MutableRefObject<any>, doSomething?: Function) {
    useEffect(() => {
        function handleClickOutside(event: any) {
            if (ref?.current && !ref?.current?.contains(event.target)) {
                if (typeof doSomething === 'function') return doSomething()
            }
        }

        try {
            document.body.addEventListener("mouseup", handleClickOutside)
            return () => {
                document.body.removeEventListener("mouseup", handleClickOutside);
            }
        }
        catch (error) {

        }
    }, [ref]);
}