import React from 'react'
import styled from '@emotion/styled'
import { Button, CircularProgress, Typography } from '@mui/material'

const RowDiv = styled.div`
  display: flex;
  align-items: center;
  margin-top: 12px;
`
const SubmitButton = styled(Button)`
  text-transform: capitalize;
  width: 140px;
  font-size: 12px;
  font-weight: 600;
  margin-right: 24px;
`

interface SubmitProps {
  handleSubmit: (e?: React.FormEvent<HTMLFormElement> | undefined) => void
  loading: boolean
}

export const SubmitSection = ({ handleSubmit, loading }: SubmitProps) => {
  return (
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
  )
}