import React, { useState } from 'react'
import styled from '@emotion/styled'
import { Formik, ErrorMessage } from 'formik'
import { requestCryptoPrice } from '../../utils/BandChain'
import {
  ResultRender,
  ResultObject,
  InputField,
  SubmitSection,
  CountSelect,
  SymbolSelect,
} from '..'
import { useRecoilValue } from 'recoil'
import { ledgerState } from 'atom/atom'

const CountDiv = styled.div`
  display: flex;
  flex-direction: row;
`
const symbolList = [
  'BTC',
  'ETH',
  'BNB',
  'SOL',
  'ADA',
  'XRP',
  'DOT',
  'DOGE',
  'SHIB',
  'MATIC',
  'LTC',
]

interface RequestFieldError {
  symbols: string
  multiplier: string
  askCount: string
  minCount: string
  clientId: string
  feeLimit: string
  prepareGas: string
  executeGas: string
}

export const CryptoRequestForm = () => {
  const [symbols, setSymbol] = useState<string[] | string>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [txResult, setTxResult] = useState<ResultObject | null>(null)
  const wallet = useRecoilValue(ledgerState)

  return (
    <>
      <Formik
        initialValues={{
          symbols: '',
          multiplier: 1,
          askCount: 1,
          minCount: 1,
          clientId: 'from_scan',
          feeLimit: 100,
          prepareGas: 30000,
          executeGas: 50000,
        }}
        validate={(values) => {
          const errors: Partial<RequestFieldError> = {}
          if (symbols.length < 1) {
            errors.symbols = 'Required'
          }
          if (!values.multiplier) {
            errors.multiplier = 'Required'
          }
          if (!values.askCount) {
            errors.askCount = 'Required'
          }
          if (!values.minCount) {
            errors.minCount = 'Required'
          }
          if (!values.clientId) {
            errors.clientId = 'Required'
          }
          if (!values.feeLimit) {
            errors.feeLimit = 'Required'
          }
          if (!values.prepareGas) {
            errors.prepareGas = 'Required'
          }
          if (!values.executeGas) {
            errors.executeGas = 'Required'
          }
          return errors
        }}
        onSubmit={async (values) => {
          const res = await requestCryptoPrice(
            { ...values, symbols: symbols },
            setLoading,
            wallet
          )
          setTxResult({
            height: res?.height,
            gasUsed: res?.gasUsed,
            txhash: res?.txhash,
            data: res?.data,
          })
        }}
      >
        {({ values, setFieldValue, handleSubmit }) => (
          <>
            <SymbolSelect
              key="symbols"
              label="Symbols"
              symbols={symbols}
              setSymbol={setSymbol}
              symbolList={symbolList}
            />
            <ErrorMessage name="symbols" component="div" />
            <InputField
              key="multiplier"
              label="Multiplier"
              setFieldValue={(newVal) => setFieldValue('multiplier', newVal)}
              value={values.multiplier}
              type="number"
            />
            <ErrorMessage name="multiplier" component="div" />
            <InputField
              key="clientId"
              label="Client ID"
              setFieldValue={(newVal) => setFieldValue('clientId', newVal)}
              value={values.clientId}
              type="text"
            />
            <ErrorMessage name="clientId" component="div" />
            <InputField
              key="feeLimit"
              label="Fee Limit (uband)"
              setFieldValue={(newVal) => setFieldValue('feeLimit', newVal)}
              value={values.feeLimit}
              type="number"
            />
            <ErrorMessage name="feeLimit" component="div" />
            <InputField
              key="prepareGas"
              label="Prepare Gas"
              setFieldValue={(newVal) => setFieldValue('prepareGas', newVal)}
              value={values.prepareGas}
              type="number"
            />
            <ErrorMessage name="prepareGas" component="div" />
            <InputField
              key="executeGas"
              label="Execute Gas"
              setFieldValue={(newVal) => setFieldValue('executeGas', newVal)}
              value={values.executeGas}
              type="number"
            />
            <ErrorMessage name="executeGas" component="div" />
            <CountDiv>
              <CountSelect
                label="Ask Count"
                askCount={values.askCount}
                minCount={values.minCount}
                setFieldValue={(newVal) => {
                  setFieldValue('askCount', newVal)
                  if (newVal < values.minCount) {
                    setFieldValue('minCount', 1)
                  }
                }}
              />
              <ErrorMessage name="askCount" component="div" />
              <CountSelect
                label="Min Count"
                askCount={values.askCount}
                minCount={values.minCount}
                setFieldValue={(newVal) => setFieldValue('minCount', newVal)}
              />
              <ErrorMessage name="minCount" component="div" />
            </CountDiv>
            <SubmitSection handleSubmit={handleSubmit} loading={loading} />
          </>
        )}
      </Formik>
      {txResult && <ResultRender result={txResult} />}
    </>
  )
}
