import { useState, useEffect } from 'react'

export type IDimension = {
    innerHeight: number,
    innerWidth: number,
    outterHeight: number,
    outterWidth: number
}

export default function useDimensions() {

    const [dimensions, setDimension] = useState<IDimension>({
        innerHeight: window.innerHeight,
        innerWidth: window.innerWidth,
        outterHeight: window.outerHeight,
        outterWidth: window.outerWidth,
    })

    useEffect(() => {
        const resize = window.addEventListener('resize', (e: any) => {
            const winTarget = e.target
            setDimension({
                innerHeight: winTarget.innerHeight,
                innerWidth: winTarget.innerWidth,
                outterHeight: winTarget.outterHeight,
                outterWidth: winTarget.outterWidth
            })
        })

        return () => window.removeEventListener('resize', () => { })
    }, [])

    return dimensions
}