import * as React from 'react';
import styled from '@emotion/styled'
import { Tab, Tabs } from '@mui/material';
import { CryptoRequestForm } from './components'

const Container = styled.div`
  width: 1080px;
  min-height: 100vh;
  border-radius: 2px;
  background-color: white;
`
const ContentDiv = styled.div`
  display: flex;
  flex-direction: column;
  padding: 18px;
`

interface TabContentProps {
  children: React.ReactElement
  value: string
  tab: string
}

type tabsName = 'crypto' | 'one' | 'two'

const TabContent = (props: TabContentProps) => {
  const { children, value, tab } = props;
  return (
    value === tab
      ? <ContentDiv>{children}</ContentDiv>
      : null
  )
}

const Home = () => {
  const [value, setValue] = React.useState<tabsName>('crypto');

  const handleChange = (event: React.ChangeEvent<{}>, newValue: tabsName) => {
    setValue(newValue);
  };
  return (
    <Container>
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="secondary"
        indicatorColor="secondary"
        variant="fullWidth"
        sx={{ borderBottom: '1px solid lightgrey' }}
      >
        <Tab value="crypto" label="Request Crypto Price" />
        <Tab value="one" label="Item One" sx={{ borderLeft: '1px solid lightgrey', borderRight: '1px solid lightgrey' }} />
        <Tab value="two" label="Item Two" />
      </Tabs>
      <TabContent value={value} tab='crypto'>
        <CryptoRequestForm />
      </TabContent>
    </Container>
  )
}

export default Home
