import React from 'react'
import { ErrorMessage, Formik } from 'formik'
import { sendCoin } from '../../utils/BandChain'
import { ResultRender, ResultObject, InputField, SubmitSection } from '..'

interface RequestFieldError {
  amount: string;
  receiver: string;
}

export const SendCoinForm = () => {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [txResult, setTxResult] = React.useState<ResultObject | null>(null)
  return (
    <>
      <Formik
        initialValues={{
          amount: "",
          receiver: "band19zpx49n8gyaqrscaklrzynm8sgavfkcmjlap9r"
        }}
        validate={values => {
          const errors: Partial<RequestFieldError> = {};
          if (!values.amount) {
            errors.amount = 'Required';
          }
          if (!values.receiver) {
            errors.receiver = 'Required';
          }
          return errors;
        }}
        onSubmit={async (values) => {
          const res = await sendCoin(values, setLoading)
          setTxResult({
            height: res?.height,
            gasUsed: res?.gasUsed,
            txhash: res?.txhash,
          })
        }}
      >
        {({ values, handleSubmit, setFieldValue }) => (
          <>
            <InputField
              key="amount"
              label="Amount (uband)"
              value={values.amount}
              setFieldValue={(newVal) => setFieldValue('amount', newVal)}
              type="text"
            />
            <ErrorMessage name="amount" component="div" />
            <InputField
              key="receiver"
              label="Receiver Address"
              value={values.receiver}
              setFieldValue={(newVal) => setFieldValue('receiver', newVal)}
              type="text"
            />
            <ErrorMessage name="receiver" component="div" />
            <SubmitSection
              handleSubmit={handleSubmit}
              loading={loading}
            />
          </>
        )}
      </Formik>
      {txResult && (
        <ResultRender
          result={txResult}
        />
      )}
    </>
  )
}