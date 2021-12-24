import styled from '@emotion/styled'
import { ErrorMessage, Formik } from 'formik'
import React from 'react'
import { InputField, SubmitSection } from '..'
import { delegateCoin } from '../../utils/BandChain'

const ResultPre = styled.pre`
  margin-top: 16px;
`

interface RequestFieldError {
  amount: string
  validator: string
  memo: string
}

export const DelegateForm = () => {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [txResult, setTxResult] = React.useState<string | null>(null)
  return (
    <>
      <Formik
        initialValues={{
          amount: "",
          validator: "bandvaloper1nlepx7xg53fsy6vslrss6adtmtl8a33kusv7fa",
          memo: ""
        }}
        validate={values => {
          const errors: Partial<RequestFieldError> = {};
          if (!values.amount) {
            errors.amount = 'Required';
          }
          if (!values.validator) {
            errors.validator = 'Required';
          }
          return errors;
        }}
        onSubmit={async (values) => {
          const res = await delegateCoin(values, setLoading)
          setTxResult(res)
        }}
      >
        {({ values, handleSubmit, setFieldValue }) =>
          <>
            <InputField
              key="amount"
              label="Amount (BAND)"
              setFieldValue={(newVal) => setFieldValue('amount', newVal)}
              value={values.amount}
              type="text"
            />
            <ErrorMessage name="amount" component="div" />
            <InputField
              key="validator"
              label="Validator Address"
              setFieldValue={(newVal) => setFieldValue('validator', newVal)}
              value={values.validator}
              type="text"
            />
            <ErrorMessage name="validator" component="div" />
            <InputField
              key="memo"
              label="Memo (Optional)"
              setFieldValue={(newVal) => setFieldValue('memo', newVal)}
              value={values.memo}
              type="text"
            />
            <ErrorMessage name="memo" component="div" />
            <SubmitSection
              loading={loading}
              handleSubmit={handleSubmit}
            />
          </>
        }
      </Formik>
      <ResultPre>
        {txResult}
      </ResultPre>
    </>
  )
}