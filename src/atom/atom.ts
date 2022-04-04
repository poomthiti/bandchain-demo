import { atom } from 'recoil'
import { PublicKey } from '@bandprotocol/bandchain.js/proto/tendermint/crypto/keys_pb'

export const ledgerState = atom({
  key: 'ledgerState',
  default: {
    publicKey: '',
    address: '',
    disconnect: () => new Promise<void>(() => null),
    sign: (msg: string) =>
      new Promise<{ signature: Buffer | null; return_code: string | number }>(
        () => ({ signature: null, return_code: '' })
      ),
  },
})
