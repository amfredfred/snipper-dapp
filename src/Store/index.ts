import accountSlice from "./Slices/accountSlice"
import { configureStore } from '@reduxjs/toolkit'
import snipperSlice from "./Slices/snipperSlice"

const store =
    configureStore({
        reducer: {
            account: accountSlice,
            snipper: snipperSlice
        }
    })

export default store