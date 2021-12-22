import React from 'react'
import styled from '@emotion/styled'
import { TextField, Typography } from '@mui/material'

const FieldContainer = styled.div`
  margin-bottom: 8px;
`
const InputLabel = styled(Typography)`
  font-size: 12px;
  font-weight: 600;
  color: #7d7d7d;
  margin-bottom: 4px;
`
interface FieldProps {
  label: string
  value: number | string
  setFieldValue: (val: number | string) => void
  type: "text" | "number"
}

export const InputField: React.FC<FieldProps> = ({ label, value, setFieldValue, type }) => {
  return (
    <FieldContainer>
      <InputLabel>{label}</InputLabel>
      <TextField
        sx={{ width: '60%' }}
        fullWidth
        value={value}
        type={type}
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