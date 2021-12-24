import styled from "@emotion/styled"
import { Checkbox, ListItemText, MenuItem, Select, Typography } from "@mui/material"
import React from "react"

const InputLabel = styled(Typography)`
  font-size: 12px;
  font-weight: 600;
  color: #7d7d7d;
  margin-bottom: 4px;
`
const FieldContainer = styled.div`
  margin-bottom: 8px;
`

interface SymbolSelectProps {
  setSymbol: React.Dispatch<React.SetStateAction<string[] | string>>
  symbols: string[] | string
  symbolList: string[]
  label: string
}

export const SymbolSelect: React.FC<SymbolSelectProps> = ({ setSymbol, symbols, symbolList, label }) => {
  return (
    <FieldContainer>
      <InputLabel>
        {label}
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