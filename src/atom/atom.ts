import { atom } from 'recoil'

export const ledgerState = atom({
  key: 'ledgerState',
  default: {
    publicKey: '',
    address: '',
    disconnect: () => new Promise<void>(() => null),
    sign: (msg: string) => new Promise<Buffer>(() => ''),
  },
})
