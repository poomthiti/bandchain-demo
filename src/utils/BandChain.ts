import {
  Client,
  Wallet,
  Obi,
  Fee,
  Coin,
  Message,
  Transaction,
} from '@bandprotocol/bandchain.js'
import TransportWebHid from '@ledgerhq/hw-transport-webhid'
import TransportWebUsb from '@ledgerhq/hw-transport-webusb'
import CosmosApp from '@ledgerhq/hw-app-cosmos'

const { PrivateKey, PublicKey } = Wallet
const grpcUrl = 'https://laozi-testnet4.bandchain.org/grpc-web'
const client = new Client(grpcUrl)

const mnemonic = 's'

const privKey = PrivateKey.fromMnemonic(mnemonic)
const pubKey = privKey.toPubkey()
const sender = pubKey.toAddress().toAccBech32()

const resultPolling = async (requestId: number) => {
  const result = await client.getRequestById(requestId)
  if (!result?.result) {
    return new Promise((resolve, _) => {
      setTimeout(() => resolve(resultPolling(requestId)), 500)
    })
  } else {
    return result?.result?.result
  }
}

interface Wallet {
  publicKey: string
  address: string
  disconnect: () => Promise<void>
  sign: (msg: string) => Promise<{
    signature: Buffer | null
    return_code: string | number
  }>
}

const signHelper = async (tx: Transaction, wallet: Wallet) => {
  let signedTx: Uint8Array | string = ''
  if (wallet.address) {
    try {
      const pubKey = PublicKey.fromHex(wallet.publicKey)
      const signMsg = tx.getSignMessage().toString()
      const { signature } = await wallet.sign(signMsg)
      signedTx = tx.getTxData(signature as Buffer, pubKey)
    } catch (err) {
      console.log(err)
    }
  } else {
    const txSignData = tx.getSignDoc(pubKey)
    const signature = privKey.sign(txSignData)
    signedTx = tx.getTxData(signature, pubKey)
  }
  return signedTx
}

interface CryptoPriceProps {
  symbols: string[] | string
  multiplier: number
  askCount: number
  minCount: number
  clientId: string
  feeLimit: number
  prepareGas: number
  executeGas: number
}

export const requestCryptoPrice = async (
  {
    symbols,
    multiplier,
    askCount,
    minCount,
    clientId,
    feeLimit,
    prepareGas,
    executeGas,
  }: CryptoPriceProps,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  wallet: Wallet
) => {
  setLoading(true)
  const obi = new Obi('{symbols:[string],multiplier:u64}/{rates:[u64]}')
  const encodedCallData = obi.encodeInput({ symbols, multiplier })
  const oracleScriptId = 37

  let coinFeeLimit = new Coin()
  coinFeeLimit.setDenom('uband')
  coinFeeLimit.setAmount(String(feeLimit))

  const requestMessage = new Message.MsgRequestData(
    oracleScriptId,
    encodedCallData,
    askCount,
    minCount,
    clientId,
    sender,
    [coinFeeLimit],
    prepareGas,
    executeGas
  )

  let feeCoin = new Coin()
  feeCoin.setDenom('uband')
  feeCoin.setAmount('50000')

  const fee = new Fee()
  fee.setAmountList([feeCoin])
  fee.setGasLimit(1000000)

  const senderAcc = wallet.address ? wallet.address : sender
  const chainId = await client.getChainId()
  const txn = new Transaction()
  txn.withMessages(requestMessage)
  await txn.withSender(client, senderAcc)
  txn.withChainId(chainId)
  txn.withFee(fee)
  txn.withMemo('')

  const signedTx = await signHelper(txn, wallet)

  const sendTx = await client.sendTxBlockMode(signedTx)

  const requestId = await client.getRequestIdByTxHash(sendTx?.txhash)

  const result = await resultPolling(Number(requestId[0]))
  const buffer = Buffer.from(result as string, 'base64')
  const decodedResult = obi.decodeOutput(buffer)
  const resultString = JSON.stringify(
    decodedResult,
    (_, value) => (typeof value === 'bigint' ? value.toString() : value),
    2
  )
  setLoading(false)
  return { ...sendTx, data: resultString }
}

interface SendCoinProps {
  amount: string
  receiver: string
}

export const sendCoin = async (
  { amount, receiver }: SendCoinProps,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  wallet: Wallet
) => {
  setLoading(true)
  const sendAmount = new Coin()
  sendAmount.setDenom('uband')
  sendAmount.setAmount(amount)

  const senderAcc = wallet.address ? wallet.address : sender
  const msg = new Message.MsgSend(senderAcc, receiver, [sendAmount])
  const chainId = await client.getChainId()
  const account = await client.getAccount(senderAcc)

  let feeCoin = new Coin()
  feeCoin.setDenom('uband')
  feeCoin.setAmount('1000')

  const fee = new Fee()
  fee.setAmountList([feeCoin])
  fee.setGasLimit(1000000)

  const tx = new Transaction()
    .withMessages(msg)
    .withAccountNum(account.accountNumber)
    .withSequence(account.sequence)
    .withChainId(chainId)
    .withFee(fee)

  const signedTx = await signHelper(tx, wallet)

  const response = await client.sendTxBlockMode(signedTx)
  console.log(response)
  setLoading(false)
  return response
}

interface GetPairProps {
  askCount: number
  minCount: number
  pairs: string[]
}

export const getPairRef = async (
  { askCount, minCount, pairs }: GetPairProps,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setLoading(true)
  const response = await client.getReferenceData(pairs, minCount, askCount)
  setLoading(false)
  return JSON.stringify(response, null, 2)
}

interface DelegateProps {
  validator: string
  amount: string
  memo: string
}

export const delegateCoin = async (
  { validator, amount, memo }: DelegateProps,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  wallet: Wallet
) => {
  setLoading(true)
  const delegateAmount = new Coin()
  delegateAmount.setDenom('uband')
  delegateAmount.setAmount(String(Number(amount) * (10 ^ 6)))

  let feeCoin = new Coin()
  feeCoin.setDenom('uband')
  feeCoin.setAmount('5000')

  const fee = new Fee()
  fee.setAmountList([feeCoin])
  fee.setGasLimit(1000000)

  const senderAcc = wallet.address ? wallet.address : sender
  const msg = new Message.MsgDelegate(senderAcc, validator, delegateAmount)
  const account = await client.getAccount(senderAcc)
  const chainId = await client.getChainId()

  const tx = new Transaction()
    .withMessages(msg)
    .withFee(fee)
    .withMemo(memo)
    .withChainId(chainId)
    .withAccountNum(account.accountNumber)
    .withSequence(account.sequence)

  const signedTx = await signHelper(tx, wallet)

  const response = await client.sendTxBlockMode(signedTx)
  setLoading(false)
  return JSON.stringify(response, null, 2)
}

export const connectLedger = async (isWindow: boolean) => {
  try {
    const transport = isWindow
      ? await TransportWebHid.create()
      : await TransportWebUsb.create()
    const disconnect = () => transport.close()
    const cosmos = new CosmosApp(transport)
    const address = await cosmos.getAddress('44/118/0/0/0', 'band')
    const sign = async (msg: string) => await cosmos.sign('44/118/0/0/0', msg)
    return { ...address, disconnect, sign }
  } catch (err) {
    alert(err)
    return {
      publicKey: '',
      address: '',
      disconnect: () => new Promise(() => null),
      sign: (msg: string) =>
        new Promise<{ signature: Buffer | null; return_code: string | number }>(
          () => ({ signature: null, return_code: '' })
        ),
    }
  }
}
