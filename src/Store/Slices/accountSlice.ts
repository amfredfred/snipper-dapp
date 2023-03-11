import { createSlice, } from '@reduxjs/toolkit'
import { AccountReducer } from '../Reducers'
import { AccountIniTs } from '../Types/Interfaces'

export const accountSlice = createSlice({
    name: 'accountSlice',
    initialState: AccountIniTs,
    reducers: { Account: (state, { payload }) => AccountReducer(state, payload) }
})

export default accountSlice.reducer
export const { Account } = accountSlice.actions