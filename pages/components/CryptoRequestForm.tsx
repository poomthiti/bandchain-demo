import React, { Dispatch, SetStateAction, useState } from 'react'
import styled from '@emotion/styled'
import { MenuItem, TextField, Typography, Select, Checkbox, ListItemText, Button, CircularProgress } from '@mui/material'
import { Formik, ErrorMessage } from 'formik'
import { requestCryptoPrice } from '../utils/BandChain'
import { ResultRender, ResultObject } from '.'

const InputLabel = styled(Typography)`
  font-size: 12px;
  font-weight: 600;
  color: #7d7d7d;
  margin-bottom: 4px;
`
const FieldContainer = styled.div`
  margin-bottom: 8px;
`
const SubmitButton = styled(Button)`
  text-transform: capitalize;
  width: 140px;
  font-size: 12px;
  font-weight: 600;
  margin-right: 24px;
`
const RowDiv = styled.div`
  display: flex;
  align-items: center;
  margin-top: 12px;
`
const CountDiv = styled.div`
  display: flex;
  flex-direction: row;
`

interface FieldProps {
  label: string
  value: number | string
  setFieldValue: (val: number | string) => void
}

const InputField: React.FC<FieldProps> = ({ label, value, setFieldValue }) => {
  return (
    <FieldContainer>
      <InputLabel>{label}</InputLabel>
      <TextField
        sx={{ width: '60%' }}
        fullWidth
        value={value}
        type={label === "Client ID" ? "text" : "number"}
        color="secondary"
        onChange={(event) => setFieldValue(event.target.value)}
        inputProps={{
          style: {
            padding: '8px 10px',
            fontSize: 14,
            height: 'auto',
          }
        }}
      />
    </FieldContainer>
  )
}

const symbolList = ['BTC', 'ETH', 'BNB', 'SOL', 'ADA', 'XRP', 'DOT', 'DOGE', 'SHIB', 'MATIC', 'LTC']

interface SymbolSelectProps {
  setSymbol: Dispatch<SetStateAction<string[] | string>>
  symbols: string[] | string
}

const SymbolSelect: React.FC<SymbolSelectProps> = ({ setSymbol, symbols }) => {
  return (
    <FieldContainer>
      <InputLabel>
        Symbols
      </InputLabel>
      <Select
        sx={{ width: '60%' }}
        multiple
        fullWidth
        value={symbols}
        color="secondary"
        SelectDisplayProps={{
          style: {
            fontSize: 14,
            padding: '8px 10px',

          },
        }}
        onChange={(event) => {
          const { target: { value } } = event
          setSymbol(value)
        }}
        renderValue={(selected) => JSON.stringify(selected)}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: (54 * 5) + 8
            }
          }
        }}
      >
        {symbolList.map(item => (
          <MenuItem key={item} value={item}>
            <Checkbox checked={symbols.indexOf(item) > -1} color="secondary" />
            <ListItemText primary={item} />
          </MenuItem>
        ))}
      </Select>
    </FieldContainer>
  )
}

interface CountSelectProps {
  setFieldValue: (val: number) => void
  count: number
  label: string
}
const askCountOption = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]

const CountSelect: React.FC<CountSelectProps> = ({ setFieldValue, count, label }) => {
  const optionArr = label === "Ask Count" ? askCountOption : [1]
  return (
    <FieldContainer>
      <InputLabel>
        {label}
      </InputLabel>
      <Select
        sx={{ width: '16vw', marginRight: 4, minWidth: '120px', maxWidth: '170px' }}
        fullWidth
        value={count}
        color="secondary"
        SelectDisplayProps={{
          style: {
            fontSize: 14,
            padding: '8px 10px',
          },
        }}
        onChange={(event) => {
          const { target: { value } } = event
          setFieldValue(Number(value))
        }}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: (36 * 8) + 8
            }
          }
        }}
      >
        {optionArr.map(item => (
          <MenuItem key={item} value={item}>
            {item}
          </MenuItem>
        ))}
      </Select>
    </FieldContainer>
  )
}

interface RequestFieldError {
  symbols: string;
  multiplier: string;
  askCount: string;
  minCount: string;
  clientId: string;
  feeLimit: string;
  prepareGas: string;
  executeGas: string;
}

export const CryptoRequestForm = () => {
  const [symbols, setSymbol] = useState<string[] | string>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [txResult, setTxResult] = useState<ResultObject | null>(null)
  const schema = "{symbols:[string],multiplier:u64}/{rates:[u64]}"

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
          executeGas: 50000
        }}
        validate={values => {
          const errors: Partial<RequestFieldError> = {};
          if (symbols.length < 1) {
            errors.symbols = 'Required';
          }
          if (!values.multiplier) {
            errors.multiplier = 'Required';
          }
          if (!values.askCount) {
            errors.askCount = 'Required';
          }
          if (!values.minCount) {
            errors.minCount = 'Required';
          }
          if (!values.clientId) {
            errors.clientId = 'Required';
          }
          if (!values.feeLimit) {
            errors.feeLimit = 'Required';
          }
          if (!values.prepareGas) {
            errors.prepareGas = 'Required';
          }
          if (!values.executeGas) {
            errors.executeGas = 'Required';
          }
          return errors;
        }}
        onSubmit={async (values) => {
          const res = await requestCryptoPrice({ ...values, symbols: symbols }, setLoading)
          setTxResult({
            height: res?.height,
            gasUsed: res?.gasUsed,
            txhash: res?.txhash,
            data: res?.data,
            schema: schema
          })
        }}
      >
        {({ values, setFieldValue, handleSubmit }) =>
          <>
            <SymbolSelect key="symbols" symbols={symbols} setSymbol={setSymbol} />
            <ErrorMessage name="symbols" component="div" />
            <InputField
              key="multiplier"
              label="Multiplier"
              setFieldValue={(newVal) => setFieldValue('multiplier', newVal)}
              value={values.multiplier}
            />
            <ErrorMessage name="multiplier" component="div" />
            <InputField
              key="clientId"
              label="Client ID"
              setFieldValue={(newVal) => setFieldValue('clientId', newVal)}
              value={values.clientId}
            />
            <ErrorMessage name="clientId" component="div" />
            <InputField
              key="feeLimit"
              label="Fee Limit (uband)"
              setFieldValue={(newVal) => setFieldValue('feeLimit', newVal)}
              value={values.feeLimit}
            />
            <ErrorMessage name="feeLimit" component="div" />
            <InputField
              key="prepareGas"
              label="Prepare Gas"
              setFieldValue={(newVal) => setFieldValue('prepareGas', newVal)}
              value={values.prepareGas}
            />
            <ErrorMessage name="prepareGas" component="div" />
            <InputField
              key="executeGas"
              label="Execute Gas"
              setFieldValue={(newVal) => setFieldValue('executeGas', newVal)}
              value={values.executeGas}
            />
            <ErrorMessage name="executeGas" component="div" />
            <CountDiv>
              <CountSelect
                label="Ask Count"
                count={values.askCount}
                setFieldValue={(newVal) => setFieldValue('askCount', newVal)}
              />
              <ErrorMessage name="askCount" component="div" />
              <CountSelect
                label="Min Count"
                count={values.minCount}
                setFieldValue={(newVal) => setFieldValue('minCount', newVal)}
              />
              <ErrorMessage name="minCount" component="div" />
            </CountDiv>
            <RowDiv>
              <SubmitButton
                variant="contained"
                color="secondary"
                disabled={loading}
                onClick={() => handleSubmit()}
              >
                Send Request
              </SubmitButton>
              {loading && (
                <>
                  <CircularProgress color="secondary" size={28} thickness={4.2} />
                  <Typography variant="body2" sx={{ marginLeft: 0.8 }}>Processing...</Typography>
                </>
              )}
            </RowDiv>
          </>
        }
      </Formik>
      {txResult && (
        <ResultRender
          height={txResult?.height}
          gasUsed={txResult?.gasUsed}
          txhash={txResult?.txhash}
          data={txResult?.data}
          schema={txResult?.schema}
        />
      )}
    </>
  )
}