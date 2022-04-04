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
import Cosmos from 'ledger-cosmos-js'
import Secp256k1 from 'secp256k1'

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
  sign: (msg: string) => Promise<Buffer>
}

const signHelper = async (tx: Transaction, wallet: Wallet) => {
  let signedTx: Uint8Array | string = ''
  if (wallet.address) {
    try {
      const pubKey = PublicKey.fromHex(wallet.publicKey)
      const signMsg = tx.getSignMessage().toString()
      const signature = await wallet.sign(signMsg)
      signedTx = tx.getTxData(signature, pubKey, 127)
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

  const senderAcc = wallet.address ? wallet.address : sender

  const requestMessage = new Message.MsgRequestData(
    oracleScriptId,
    encodedCallData,
    askCount,
    minCount,
    clientId,
    senderAcc,
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

  let feeCoin = new Coin()
  feeCoin.setDenom('uband')
  feeCoin.setAmount('1000')

  const fee = new Fee()
  fee.setAmountList([feeCoin])
  fee.setGasLimit(1000000)

  const tx = new Transaction()
    .withMessages(msg)
    .withChainId(chainId)
    .withFee(fee)
    .withMemo('')

  await tx.withSender(client, senderAcc)

  const signedTx = await signHelper(tx, wallet)

  const response = await client.sendTxBlockMode(signedTx)

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
  delegateAmount.setAmount(String(Number(amount) * 10 ** 6))

  let feeCoin = new Coin()
  feeCoin.setDenom('uband')
  feeCoin.setAmount('5000')

  const fee = new Fee()
  fee.setAmountList([feeCoin])
  fee.setGasLimit(1000000)

  const senderAcc = wallet.address ? wallet.address : sender
  const msg = new Message.MsgDelegate(senderAcc, validator, delegateAmount)
  const chainId = await client.getChainId()

  const tx = new Transaction()
    .withMessages(msg)
    .withFee(fee)
    .withMemo(memo)
    .withChainId(chainId)

  await tx.withSender(client, senderAcc)

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
    const path = [44, 118, 0, 0, 0]
    const cosmos = new Cosmos(transport)
    const { bech32_address, compressed_pk } = await cosmos.getAddressAndPubKey(
      path,
      'band'
    )
    const sign = async (msg: string) => {
      const { signature } = await cosmos.sign(path, msg)
      return Buffer.from(Secp256k1.signatureImport(signature))
    }
    return {
      address: bech32_address,
      publicKey: Buffer.from(compressed_pk).toString('hex'),
      disconnect,
      sign,
    }
  } catch (err) {
    alert(err)
    return {
      publicKey: '',
      address: '',
      disconnect: () => new Promise<void>(() => null),
      sign: (msg: string) => new Promise<Buffer>(() => ''),
    }
  }
}
