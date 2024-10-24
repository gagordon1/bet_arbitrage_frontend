import React from "react";
import styled from "styled-components";

// Define the structure of the market props
interface MarketProps {
  platform: string;
  yes_ask: number;
  yes_bid: number;
  no_ask: number;
  no_bid: number;
  question: string;
}

const Market: React.FC<MarketProps> = ({
  platform,
  yes_ask,
  yes_bid,
  no_ask,
  no_bid,
  question,
}) => {
  return (
    <MarketContainer>
      <Platform>{platform}</Platform>
      <QuestionContainer>
        <Question><strong>Question:</strong> {question}</Question>
      </QuestionContainer>
      <ContentContainer>
        <Row>
          <Label>Yes Ask:</Label>
          <Value>{yes_ask}</Value>
        </Row>
        <Row>
          <Label>Yes Bid:</Label>
          <Value>{yes_bid}</Value>
        </Row>
        <Row>
          <Label>No Ask:</Label>
          <Value>{no_ask}</Value>
        </Row>
        <Row>
          <Label>No Bid:</Label>
          <Value>{no_bid}</Value>
        </Row>
      </ContentContainer>
    </MarketContainer>
  );
};

// Styled Components for the Market component
const MarketContainer = styled.div`
  border: 1px solid #8b8b83;  /* Muted gray */
  background-color: #dfe6e9;  /* Soft white */
  padding: 10px;
  margin: 5px;
  flex: 1;
  text-align: center;
  color: #2d4030;  /* Dark green */
  display: flex;
  flex-direction: column;
`;

const Platform = styled.h4`
  margin-bottom: 10px;
  font-size: 1.2em;
  color: #2d4030;  /* Dark green */
`;

const QuestionContainer = styled.div`
  min-height: 50px;  /* Set minimum height to keep questions uniform */
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
`;

const Question = styled.p`
  font-size: 0.9em;
  color: #55675b;  /* Muted gray-green */
  text-align: center;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;  /* Ensure rows are evenly spaced */
  flex-grow: 1;  /* Take up the remaining height, ensuring rows stay aligned */
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  align-items: center;  /* Ensures values and labels are aligned properly */
`;

const Label = styled.span`
  font-weight: bold;
  color: #4d5e50;  /* Muted gray-green */
`;

const Value = styled.span`
  color: #2d4030;  /* Dark green */
`;

export default Market;
