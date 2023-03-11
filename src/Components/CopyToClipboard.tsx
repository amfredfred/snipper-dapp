import { Button } from '@mui/material'
import { ContentCopy } from '@mui/icons-material'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toast } from 'react-toastify'

export default function ({ Text, hidden = false }: { Text: string, hidden?: boolean }) {
    return (
        <CopyToClipboard text={Text}
            onCopy={() => toast.success(Text + ' \nCopied To Clipboard...', { toastId: 'SUCCESS_ID' })}
        >
            <Button >
                {!hidden && Text}&nbsp;&nbsp;<ContentCopy />
            </Button>
        </CopyToClipboard>

    )
}