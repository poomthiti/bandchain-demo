import React from 'react'
import styled from '@emotion/styled'
import { Obi } from '@bandprotocol/bandchain.js'
import { Typography } from '@mui/material'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 16px;
`
const RowDiv = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid #E5E5E5;
  padding: 16px;
`
const ValueText = styled(Typography)`
  font-size: 14px;
  font-weight: 600;
  text-align: left;
  flex: 0.7;
`

const KeyText = styled(ValueText)`
  font-weight: 500;
  color: #7d7d7d;
  flex: 0.3;
`

export type ResultObject = {
  height: number
  gasUsed: number
  txhash: string
}

interface RenderProps {
  result: ResultObject
  queryLoading?: boolean
  queryData?: string | undefined
  schema?: string
}

export const ResultRender: React.FC<RenderProps> = ({ result, queryData, schema }) => {
  const { height, gasUsed, txhash } = result
  let resultString;
  if (schema && queryData) {
    const obi = new Obi(schema)
    const subStr = queryData?.substring(2)
    const buffer = Buffer.from(subStr, 'hex')
    const decodedData = obi.decodeOutput(buffer)
    resultString = JSON.stringify(decodedData, (_, value) => typeof value === 'bigint' ? value.toString() : value, 2)
  }
  return (
    <Container>
      <RowDiv>
        <KeyText>
          Block Height
        </KeyText>
        <ValueText>
          {height}
        </ValueText>
      </RowDiv>
      <RowDiv>
        <KeyText>
          Gas used
        </KeyText>
        <ValueText>
          {gasUsed}
        </ValueText>
      </RowDiv>
      <RowDiv>
        <KeyText>
          Transaction Hash
        </KeyText>
        <ValueText>
          {txhash}
        </ValueText>
      </RowDiv>
      {schema && (
        <RowDiv>
          <KeyText>
            Request Result
          </KeyText>
          <ValueText>
            {resultString}
          </ValueText>
        </RowDiv>
      )}
    </Container>
  )
}
