import { ElemetnsProps } from "../Store/Types/Interdaces";
import MainDrawer from "./Drawers/MainDrawer";
import Footer from "./Footer";
import Header from "./Header";

export default function (props: ElemetnsProps) {
    const { children } = props
    return (
        <main className="main-wrapper">
            <MainDrawer />
            <div className="main-cintainer">
                <Header />
                <div className="main-content">
                    {children}
                </div>
                <Footer />
            </div>
        </main>
    )
}