import { createSlice, } from '@reduxjs/toolkit'
import { BotConfigReducer, } from '../Reducers'
import { BotConfigIniTs } from '../Types/Interfaces'

export const snipperSlice = createSlice({
    name: 'snipperSlice',
    initialState: BotConfigIniTs,
    reducers: { snipperConfig: (state, { payload }) => BotConfigReducer(state, payload) }
})

export default snipperSlice.reducer
export const { snipperConfig } = snipperSlice.actions