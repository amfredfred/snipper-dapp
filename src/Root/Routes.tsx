import { BrowserRouter as BR, Routes, Route } from 'react-router-dom'
import Master from '../Layouts/Master'
import Wallet from '../Views/Wallet'
import Dashboard from '../Views/Dashboard'

function RootRoutes() {
    return (
        <Master>
            <Routes>
                <Route path='/' element={<Dashboard />} />
                <Route path='/account' element={<Wallet />} />
            </Routes>
        </Master>
    )
}

export default function () {
    return (
        <BR>
            <RootRoutes />
        </BR>
    )
}