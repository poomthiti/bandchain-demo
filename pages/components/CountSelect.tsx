import React from 'react'
import styled from '@emotion/styled'
import { MenuItem, Select, Typography } from '@mui/material'

const FieldContainer = styled.div`
  margin-bottom: 8px;
`
const InputLabel = styled(Typography)`
  font-size: 12px;
  font-weight: 600;
  color: #7d7d7d;
  margin-bottom: 4px;
`

interface CountSelectProps {
  setFieldValue: (val: number) => void
  minCount: number
  askCount: number
  label: string
}

const maxCountArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]

export const CountSelect: React.FC<CountSelectProps> = ({ setFieldValue, minCount, askCount, label }) => {
  let optionArr: number[] = [1];
  if (label === "Min Count") {
    optionArr = maxCountArr.slice(0, askCount)
  }
  return (
    <FieldContainer>
      <InputLabel>
        {label}
      </InputLabel>
      <Select
        sx={{ width: '16vw', marginRight: 4, minWidth: '120px', maxWidth: '170px' }}
        fullWidth
        value={label === "Min Count" ? minCount : askCount}
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
        {(label === "Min Count" ? optionArr : maxCountArr).map(item => (
          <MenuItem key={item} value={item}>
            {item}
          </MenuItem>
        ))}
      </Select>
    </FieldContainer>
  )
}