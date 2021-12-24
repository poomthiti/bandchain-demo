import React from 'react'
import styled from '@emotion/styled'
import { CountSelect, SubmitSection, SymbolSelect } from '..'
import { ErrorMessage, Formik } from 'formik'
import { getPairRef } from '../../utils/BandChain'

const CountDiv = styled.div`
  display: flex;
  flex-direction: row;
`
const ResultPre = styled.pre`
  margin-top: 16px;
`

interface RequestFieldError {
  askCount: string;
  minCount: string;
  pairs: string;
}

const pairsList = ["BTC/USD", "BTC/ETH", "BTC/SOL", "ETH/USD", "ETH/BTC", "SOL/USD", "SOL/BTC", "ADA/USD", "ADA/BTC", "ADA/ETH"]

export const GetPairForm = () => {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [txResult, setTxResult] = React.useState<string | null>(null)
  return (
    <>
      <Formik
        initialValues={{
          askCount: 1,
          minCount: 1,
          pairs: []
        }}
        validate={values => {
          const errors: Partial<RequestFieldError> = {};
          if (!values.askCount) {
            errors.askCount = 'Required';
          }
          if (!values.minCount) {
            errors.minCount = 'Required';
          }
          if (values.pairs.length < 1) {
            errors.pairs = 'Required';
          }
          return errors;
        }}
        onSubmit={async (values) => {
          const res = await getPairRef(values, setLoading)
          setTxResult(res)
        }}
      >
        {({ values, handleSubmit, setFieldValue }) => (
          <>
            <SymbolSelect
              key="pairs"
              label="Symbol Pairs"
              symbols={values.pairs}
              setSymbol={(newVal) => setFieldValue('pairs', newVal)}
              symbolList={pairsList}
            />
            <ErrorMessage name="pairs" component="div" />
            <CountDiv>
              <CountSelect
                label="Ask Count"
                askCount={values.askCount}
                minCount={values.minCount}
                setFieldValue={(newVal) => {
                  setFieldValue('askCount', newVal)
                  if (newVal < values.minCount) { setFieldValue('minCount', 1) }
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
            <SubmitSection
              handleSubmit={handleSubmit}
              loading={loading}
            />
          </>
        )}
      </Formik>
      <ResultPre>
        {txResult}
      </ResultPre>
    </>
  )
}