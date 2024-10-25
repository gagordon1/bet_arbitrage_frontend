import React, { useState } from "react";
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
  // State to control whether the question is shown
  const [showQuestion, setShowQuestion] = useState(false);

  // Toggle the visibility of the question when the platform name is clicked
  const handleToggleQuestion = () => {
    setShowQuestion(!showQuestion);
  };

  return (
    <MarketContainer>
      {/* Clicking the platform name toggles the question */}
      <Platform onClick={handleToggleQuestion}>
        {platform}
      </Platform>

      {/* Show the question box only if showQuestion is true */}
      {showQuestion && (
        <QuestionBox>
          <Question>{question}</Question>
        </QuestionBox>
      )}

      <ContentContainer>
        <Row>
          <Label>Yes Ask:</Label>
          <Value>${yes_ask.toFixed(2)}</Value>
        </Row>
        <Row>
          <Label>Yes Bid:</Label>
          <Value>${yes_bid.toFixed(2)}</Value>
        </Row>
        <Row>
          <Label>No Ask:</Label>
          <Value>${no_ask.toFixed(2)}</Value>
        </Row>
        <Row>
          <Label>No Bid:</Label>
          <Value>${no_bid.toFixed(2)}</Value>
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
  height: 40px;
  margin: 5px;
  font-size: 1.2em;
  color: #2d4030;  /* Dark green */
  cursor: pointer;  /* Add pointer to indicate clickability */

  &:hover {
    text-decoration: underline;  /* Indicate hover state */
  }
`;

const QuestionBox = styled.div`
  border: 1px solid #4d5e50;  /* Muted gray-green */
  background-color: #fff;
  padding: 10px;
  margin-top: 10px;
  text-align: left;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Question = styled.p`
  font-size: 0.9em;
  color: #55675b;  /* Muted gray-green */
  margin: 0;
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
