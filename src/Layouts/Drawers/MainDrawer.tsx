import { WalletRounded, WalletTwoTone, Explore, CurrencyExchange, InfoRounded, DashboardCustomize } from '@mui/icons-material'
import { Link } from 'react-router-dom'

export default function () {
    return (
        <div className='drawer-menu' >
            <nav className="nav-main">
                <div className="logo-container">
                    <Link to={'/'}>
                        CANALIFY
                    </Link>
                </div>
                <ul className="nav-ul">
                    <li className="nav-li">
                        <Link to={'/'} className='nav-link'>
                            <div className="nav-icon">
                                <DashboardCustomize className='nav-icon' />
                            </div>
                            <span className="nav-name">
                                SnipeBoard
                            </span>
                        </Link>
                    </li>
                    <li className="nav-li">
                        <Link to={'/account'} className='nav-link'>
                            <div className="nav-icon">
                                <WalletTwoTone className='nav-icon' />
                            </div>
                            <span className="nav-name">
                                Connected Account
                            </span>
                        </Link>
                    </li>

                    <li className="nav-li">
                        <Link to={'/wallet'} className='nav-link'>
                            <div className="nav-icon">
                                <Explore className='nav-icon' />
                            </div>
                            <span className="nav-name">
                                Token Explorer
                            </span>
                        </Link>
                    </li>

                    <li className="nav-li">
                        <Link to={'/wallet'} className='nav-link'>
                            <div className="nav-icon">
                                <InfoRounded className='nav-icon' />
                            </div>
                            <span className="nav-name">
                                Address Info
                            </span>
                        </Link>
                    </li>

                    <li className="nav-li">
                        <Link to={'/wallet'} className='nav-link'>
                            <div className="nav-icon">
                                <CurrencyExchange className='nav-icon' />
                            </div>
                            <span className="nav-name">
                                Swap
                            </span>
                        </Link>
                    </li>

                    <li className="nav-li">
                        <Link to={'/wallet'} className='nav-link'>
                            <div className="nav-icon">
                                <WalletRounded className='nav-icon' />
                            </div>
                            <span className="nav-name">
                                Wallet
                            </span>
                        </Link>
                    </li>

                    <li className="nav-li">
                        <Link to={'/wallet'} className='nav-link'>
                            <div className="nav-icon">
                                <WalletRounded className='nav-icon' />
                            </div>
                            <span className="nav-name">
                                Wallet
                            </span>
                        </Link>
                    </li>

                    <li className="nav-li">
                        <Link to={'/wallet'} className='nav-link'>
                            <div className="nav-icon">
                                <WalletRounded className='nav-icon' />
                            </div>
                            <span className="nav-name">
                                Wallet
                            </span>
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    )
}