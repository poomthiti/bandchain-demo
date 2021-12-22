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
  data: string
  schema?: string
}

export const ResultRender: React.FC<ResultObject> = ({ height, gasUsed, txhash, data, schema = "" }) => {
  let decodedData;
  if (schema) {
    // const obi = new Obi(schema)
    // const result = "\\x000000010000000000000fd2"
    // const buffer = Buffer.from(result)
    // console.log(buffer)
    // decodedData = obi.decodeOutput(buffer)
    // console.log(decodedData)
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
      <RowDiv>
        <KeyText>
          Result
        </KeyText>
        <ValueText>
          {data}
        </ValueText>
      </RowDiv>
    </Container>
  )
}
