import {
  Client,
  Wallet,
  Obi,
  Fee,
  Coin,
  Message,
  Transaction,
} from "@bandprotocol/bandchain.js";

const { PrivateKey } = Wallet;
const grpcUrl = "https://laozi-testnet4.bandchain.org/grpc-web";
const client = new Client(grpcUrl);

const mnemonic = "s";

const privKey = PrivateKey.fromMnemonic(mnemonic);
const pubKey = privKey.toPubkey();
const sender = pubKey.toAddress().toAccBech32();

const resultPolling = async (requestId: number) => {
  const result = await client.getRequestById(requestId);
  if (!result?.result) {
    return new Promise((resolve, _) => {
      setTimeout(() => resolve(resultPolling(requestId)), 500);
    });
  } else {
    return result?.result?.result;
  }
};

interface CryptoPriceProps {
  symbols: string[] | string;
  multiplier: number;
  askCount: number;
  minCount: number;
  clientId: string;
  feeLimit: number;
  prepareGas: number;
  executeGas: number;
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
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setLoading(true);
  const obi = new Obi("{symbols:[string],multiplier:u64}/{rates:[u64]}");
  const encodedCallData = obi.encodeInput({ symbols, multiplier });
  const oracleScriptId = 37;

  let coinFeeLimit = new Coin();
  coinFeeLimit.setDenom("uband");
  coinFeeLimit.setAmount(String(feeLimit));

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
  );

  let feeCoin = new Coin();
  feeCoin.setDenom("uband");
  feeCoin.setAmount("50000");

  const fee = new Fee();
  fee.setAmountList([feeCoin]);
  fee.setGasLimit(1000000);

  const chainId = await client.getChainId();
  const txn = new Transaction();
  txn.withMessages(requestMessage);
  await txn.withSender(client, sender);
  txn.withChainId(chainId);
  txn.withFee(fee);
  txn.withMemo("");

  const signDoc = txn.getSignDoc(pubKey);
  const signature = privKey.sign(signDoc);

  const txRawBytes = txn.getTxData(signature, pubKey);

  const sendTx = await client.sendTxBlockMode(txRawBytes);

  const requestId = await client.getRequestIdByTxHash(sendTx?.txhash);

  const result = await resultPolling(Number(requestId[0]));
  const buffer = Buffer.from(result as string, "base64");
  const decodedResult = obi.decodeOutput(buffer);
  const resultString = JSON.stringify(
    decodedResult,
    (_, value) => (typeof value === "bigint" ? value.toString() : value),
    2
  );
  setLoading(false);
  return { ...sendTx, data: resultString };
};

interface SendCoinProps {
  amount: string;
  receiver: string;
}

export const sendCoin = async (
  { amount, receiver }: SendCoinProps,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setLoading(true);
  const sendAmount = new Coin();
  sendAmount.setDenom("uband");
  sendAmount.setAmount(amount);

  const msg = new Message.MsgSend(sender, receiver, [sendAmount]);
  const chainId = await client.getChainId();
  const account = await client.getAccount(sender);

  let feeCoin = new Coin();
  feeCoin.setDenom("uband");
  feeCoin.setAmount("1000");

  const fee = new Fee();
  fee.setAmountList([feeCoin]);
  fee.setGasLimit(1000000);

  const tx = new Transaction()
    .withMessages(msg)
    .withAccountNum(account.accountNumber)
    .withSequence(account.sequence)
    .withChainId(chainId)
    .withFee(fee);

  const txSignData = tx.getSignDoc(pubKey);
  const signature = privKey.sign(txSignData);
  const signedTx = tx.getTxData(signature, pubKey);

  const response = await client.sendTxBlockMode(signedTx);
  setLoading(false);
  return response;
};

interface GetPairProps {
  askCount: number;
  minCount: number;
  pairs: string[];
}

export const getPairRef = async (
  { askCount, minCount, pairs }: GetPairProps,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setLoading(true);
  const response = await client.getReferenceData(pairs, minCount, askCount);
  setLoading(false);
  return JSON.stringify(response, null, 2);
};

interface DelegateProps {
  validator: string;
  amount: string;
  memo: string;
}

export const delegateCoin = async (
  { validator, amount, memo }: DelegateProps,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setLoading(true);
  const delegateAmount = new Coin();
  delegateAmount.setDenom("uband");
  delegateAmount.setAmount(String((Number(amount) * 10) ^ 6));

  let feeCoin = new Coin();
  feeCoin.setDenom("uband");
  feeCoin.setAmount("5000");

  const fee = new Fee();
  fee.setAmountList([feeCoin]);
  fee.setGasLimit(1000000);

  const msg = new Message.MsgDelegate(sender, validator, delegateAmount);
  const account = await client.getAccount(sender);
  const chainId = await client.getChainId();

  const tx = new Transaction()
    .withMessages(msg)
    .withFee(fee)
    .withMemo(memo)
    .withChainId(chainId)
    .withAccountNum(account.accountNumber)
    .withSequence(account.sequence);

  const txSignData = tx.getSignDoc(pubKey);
  const signature = privKey.sign(txSignData);
  const signedTx = tx.getTxData(signature, pubKey);

  const response = await client.sendTxBlockMode(signedTx);
  setLoading(false);
  return JSON.stringify(response, null, 2);
};
