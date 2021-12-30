import React from "react";
import styled from "@emotion/styled";
import { Typography } from "@mui/material";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 16px;
`;
const RowDiv = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e5e5e5;
  padding: 16px;
`;
const ValueText = styled(Typography)`
  font-size: 14px;
  font-weight: 600;
  text-align: left;
  flex: 0.7;
`;

const KeyText = styled(ValueText)`
  font-weight: 500;
  color: #7d7d7d;
  flex: 0.3;
`;

export type ResultObject = {
  height: number;
  gasUsed: number;
  txhash: string;
  data?: string;
};

interface RenderProps {
  result: ResultObject;
}

export const ResultRender: React.FC<RenderProps> = ({ result }) => {
  const { height, gasUsed, txhash } = result;

  return (
    <Container id="result-container">
      <RowDiv>
        <KeyText>Block Height</KeyText>
        <ValueText>{height}</ValueText>
      </RowDiv>
      <RowDiv>
        <KeyText>Gas used</KeyText>
        <ValueText>{gasUsed}</ValueText>
      </RowDiv>
      <RowDiv>
        <KeyText>Transaction Hash</KeyText>
        <ValueText>{txhash}</ValueText>
      </RowDiv>
      {result.data && (
        <RowDiv>
          <KeyText>Request Result</KeyText>
          <ValueText id="symbols-result">{result.data}</ValueText>
        </RowDiv>
      )}
    </Container>
  );
};
