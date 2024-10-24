import React from "react";
import styled from "styled-components";
import Market from "./Market";

// Define the structure of the market
interface Market {
  id: string | null;
  no_ask: number;
  no_bid: number;
  no_id: string | null;
  platform: string;
  question: string;
  yes_ask: number;
  yes_bid: number;
  yes_id: string | null;
}

// Define the structure of a bet opportunity
interface BetOpportunityProps {
  question: string;
  absolute_return: number[];
  last_update: string;
  market_1: Market;
  market_2: Market;
}

const BetOpportunity: React.FC<BetOpportunityProps> = ({
  question,
  absolute_return,
  last_update,
  market_1,
  market_2,
}) => {
  // Format absolute returns as percentages with one decimal place
  const yesReturn = `${(absolute_return[0] * 100).toFixed(1)}%`;
  const noReturn = `${(absolute_return[1] * 100).toFixed(1)}%`;

  return (
    <Container>
      <Title>{question}</Title>

      <MarketContainer>
        <Market
          platform={market_1.platform}
          yes_ask={market_1.yes_ask}
          yes_bid={market_1.yes_bid}
          no_ask={market_1.no_ask}
          no_bid={market_1.no_bid}
          question={market_1.question}
        />
        <Market
          platform={market_2.platform}
          yes_ask={market_2.yes_ask}
          yes_bid={market_2.yes_bid}
          no_ask={market_2.no_ask}
          no_bid={market_2.no_bid}
          question={market_2.question}
        />
      </MarketContainer>

      <ReturnTable>
        <thead>
          <tr>
            <TableHeader>Outcome</TableHeader>
            <TableHeader>Return</TableHeader>
          </tr>
        </thead>
        <tbody>
          <TableRow>
            <TableCell>Yes</TableCell>
            <TableCell>{yesReturn}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>No</TableCell>
            <TableCell>{noReturn}</TableCell>
          </TableRow>
        </tbody>
      </ReturnTable>

      <LastUpdate>Last Update: {new Date(last_update).toLocaleString()}</LastUpdate>
    </Container>
  );
};

// Styled Components using the forest-inspired color scheme
const Container = styled.div`
  flex-basis: 48%;
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #8b8b83;
  background-color: #eef1f2;  /* Soft white */
  color: #2d4030;  /* Dark forest green */
  box-sizing: border-box;

  /* Media query for responsiveness */
  @media (max-width: 768px) {
    flex-basis: 100%;
  }
`;

const Title = styled.h3`
  margin-bottom: 15px;
  color: #2d4030;  /* Dark forest green */
`;

const MarketContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ReturnTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;

  th,
  td {
    padding: 8px;
    text-align: left;
    border-bottom: 1px solid #8b8b83;
  }
`;

const TableHeader = styled.th`
  color: #4d5e50;  /* Muted gray-green */
  font-weight: bold;
`;

const TableRow = styled.tr``;

const TableCell = styled.td`
  color: #2d4030;  /* Dark forest green */
`;

const LastUpdate = styled.p`
  font-size: 0.9em;
  color: #55675b;  /* Muted gray */
  margin-top: 10px;
`;

export default BetOpportunity;
