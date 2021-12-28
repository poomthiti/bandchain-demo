import * as React from 'react';
import styled from '@emotion/styled'
import { Tab, Tabs } from '@mui/material';
import { CryptoRequestForm, DelegateForm, SendCoinForm } from '../components'
import { GetPairForm } from '../components/form/GetPairForm';

const Container = styled.div`
  width: 100%;
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

type tabsName = 'crypto' | 'sendcoin' | 'getpair' | 'delegate'

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
        <Tab value="crypto" label="Request Crypto Price" id='crypto' />
        <Tab
          value="sendcoin"
          label="Send Band Token"
          sx={{ borderLeft: '1px solid lightgrey', borderRight: '1px solid lightgrey' }}
          id='sendcoin'
        />
        <Tab value="getpair" label="Get Reference Data" sx={{ borderRight: '1px solid lightgrey' }} id='getpair' />
        <Tab value="delegate" label="Delegate" id='delegate' />
      </Tabs>
      <TabContent value={value} tab='crypto'>
        <CryptoRequestForm />
      </TabContent>
      <TabContent value={value} tab='sendcoin'>
        <SendCoinForm />
      </TabContent>
      <TabContent value={value} tab='getpair'>
        <GetPairForm />
      </TabContent>
      <TabContent value={value} tab='delegate'>
        <DelegateForm />
      </TabContent>
    </Container>
  )
}

export default Home
