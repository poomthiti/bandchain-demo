import React from 'react'
import styled from '@emotion/styled'

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: black;
`

export const MainContainer = ({ children }: any) => {
  return <AppContainer>{children}</AppContainer>
}

