import { useEthersContext } from "../Contexts/WalletContext"
import formatNumToLocal from "../Helpers/formatNumToLocal"
import * as NP from '../Helpers/nPoint'
import { useSelector, useDispatch } from 'react-redux'
import { AccountTs, AppTs } from "../Store/Types/Interfaces"
import { useContractsContext } from "../Contexts/ContractsContext"
import { Account } from '../Store/Slices/accountSlice'
import { useEffect } from 'react'

export function useBalances() {
    const { provider, address, baseToken } = useEthersContext()
    const { ERC20Token } = useContractsContext()
    const aState = useSelector<AppTs, AccountTs>(state => state.account)
    const aDispatch = useDispatch()

    function handleAccountInfoUpdate(action: AccountTs['actions'], state: any) {
        aDispatch(Account({ type: action, payload: state }))
    }

    async function query_my_blalances() {
        const [ETH, Base] = await Promise.allSettled([
            provider?.getBalance(address ?? ''),
            ERC20Token(baseToken['address']).balanceOf(address)
        ])
        const bal = {
            ...(aState as any)?.balance,
            eth: formatNumToLocal(NP.from_wei((ETH as any)?.value)),
            base: formatNumToLocal(NP.from_wei((Base as any)?.value, baseToken['decimals']))
        }
        handleAccountInfoUpdate('balance', bal)
        return bal
    }

    useEffect(() => {
        let notBusy = true
        const refetchBalance = setInterval(async () => {
            if (notBusy) {
                notBusy = false
                await query_my_blalances()
                notBusy = true
            }
        }, 3000)

        return () => clearInterval(refetchBalance)
    }, [])

    return { query_my_blalances }
}