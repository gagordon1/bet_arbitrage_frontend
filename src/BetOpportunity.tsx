import React from "react";
import styled from "styled-components";
import Market from "./Market";
import axios from "axios";
import { API_HOST_TEST } from "./Constants";  // Assuming you have an API host constant defined

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
  id: string; // Adding an id to identify the bet opportunity
  question: string;
  absolute_return: number[];
  last_update: string;
  market_1: Market;
  market_2: Market;
  onDelete: (id: string) => void;  // Function to handle delete on parent
}

const BetOpportunity: React.FC<BetOpportunityProps> = ({
  id,
  question,
  absolute_return,
  last_update,
  market_1,
  market_2,
  onDelete,
}) => {
  // Format absolute returns as percentages with one decimal place
  const yesReturn = `${(absolute_return[0] * 100).toFixed(1)}%`;
  const noReturn = `${(absolute_return[1] * 100).toFixed(1)}%`;

  // Handle delete request for this bet opportunity
  const handleDelete = async () => {
    try {
      await axios.delete(`${API_HOST_TEST}/bet_opportunities/${id}`);
      onDelete(id);  // Call the parent handler to update the state after deletion
    } catch (err) {
      console.error("Error deleting bet opportunity", err);
    }
  };

  return (
    <Container>
      <DeleteButton onClick={handleDelete}>X</DeleteButton>
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
  padding: 5px;
  position: relative;
  border: 1px solid #8b8b83;
  background-color: #eef1f2;  /* Soft white */
  color: #2d4030;  /* Dark forest green */
  box-sizing: border-box;
  
  display: flex;
  flex-direction: column;  /* Stack the children vertically */
  justify-content: space-between;  /* Ensure space is distributed evenly */
  height: 100%;  /* Full height */

  /* Media query for responsiveness */
  @media (max-width: 768px) {
    flex-basis: 100%;
  }
`;

const DeleteButton = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  color: red;  /* Red text color */
  font-size: 0.8rem;
  cursor: pointer;

  &:hover {
    color: darkred;  /* Darker red on hover */
  }
`;


const Title = styled.h3`
  height: 80px;
  color: #2d4030;  /* Dark forest green */
  justify-content: left;
`;

const MarketContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;  /* Optional: Add space between market container and table */
`;

const ReturnTable = styled.table`
  width: 100%;
  border-collapse: collapse;  /* Ensure the borders collapse nicely */
  margin-top: 10px;
  flex-grow: 0;
`;

const TableHeader = styled.th`
  color: #4d5e50;  /* Muted gray-green */
  font-weight: bold;
  border-bottom: 1px solid #8b8b83;  /* Add border to the header cells */
  padding: 10px;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #8b8b83;  /* Add border to the row */
`;

const TableCell = styled.td`
  color: #2d4030;  /* Dark forest green */
  padding: 10px;
  border-bottom: 1px solid #8b8b83;  /* Add border to each cell */
`;


const LastUpdate = styled.p`
  font-size: 0.9em;
  color: #55675b;  /* Muted gray */
  margin-top: 20px;
`;

export default BetOpportunity;
