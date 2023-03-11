import '../Assets/styles/styles.scss'
import 'react-toastify/dist/ReactToastify.css';

export default function useAssets() {
    return {
        'photos': {
            'codeOne': require('../Assets/photos/poly_digital-14.jpg')
        }
    }
}