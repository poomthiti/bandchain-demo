import { Button, Box } from '@mui/material'
import styled from '@emotion/styled'
import { connectLedger } from 'utils/BandChain'
import { useRecoilState } from 'recoil'
import { ledgerState } from 'atom/atom'

const StyledButton = styled(Button)`
  text-transform: capitalize;
  width: 200px;
  font-size: 12px;
  font-weight: 600;
`

export const LedgerConnect = () => {
  const [wallet, setLedgerState] = useRecoilState(ledgerState)
  const isWindow = navigator.userAgent.match(/NT/) ? true : false

  return (
    <>
      <StyledButton
        variant="contained"
        color="secondary"
        onClick={async () => {
          const address = await connectLedger(isWindow)
          setLedgerState(address)
        }}
        disabled={wallet.address ? true : false}
      >
        Connect With Ledger
      </StyledButton>
      {wallet.address && (
        <StyledButton
          variant="contained"
          color="primary"
          onClick={async () => {
            await wallet.disconnect()
            setLedgerState({
              publicKey: '',
              address: '',
              disconnect: () => new Promise<void>(() => null),
              sign: (msg: string) => new Promise<Buffer>(() => ''),
            })
          }}
          sx={{ marginTop: '16px' }}
          disabled={!wallet.address ? true : false}
        >
          Disconnect
        </StyledButton>
      )}
      <Box sx={{ marginTop: '24px' }}>
        Public Key: {wallet.publicKey} <br />
        <br />
        Address: {wallet.address}
      </Box>
    </>
  )
}
