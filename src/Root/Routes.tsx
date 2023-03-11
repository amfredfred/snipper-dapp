import { BrowserRouter as BR, Routes, Route } from 'react-router-dom'
import Master from '../Layouts/Master'
import Wallet from '../Views/Wallet'
import Dashboard from '../Views/Dashboard'
import { ToastContainer } from 'react-toastify';
import WalletContext from '../Contexts/WalletContext';
import ContractsContext from '../Contexts/ContractsContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import store from '../Store'

function RootRoutes() {
    return (
        <Master>
            <Routes>
                <Route path='/' element={<Dashboard />} />
                <Route path='/account' element={<Wallet />} />
            </Routes>
            <ToastContainer />
        </Master>
    )
}

export default function () {
    const client = new QueryClient()
    return (
        <BR>
            <Provider store={store}>
                <QueryClientProvider client={client}>
                    <WalletContext>
                        <ContractsContext>
                            <RootRoutes />
                        </ContractsContext>
                    </WalletContext>
                </QueryClientProvider>
            </Provider>
        </BR>
    )
}