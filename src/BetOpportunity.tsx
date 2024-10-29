import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Market from "./Market";
import axios from "axios";
import { API_HOST_TEST } from "./Constants";

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

interface BetOpportunityProps {
  id: string;
  question: string;
  absolute_return: number[];
  last_update: string;
  market_1: Market;
  market_2: Market;
  onDelete: (id: string) => void;
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
  const navigate = useNavigate(); // Initialize useNavigate

  const yesReturn = `${(absolute_return[0] * 100).toFixed(1)}%`;
  const noReturn = `${(absolute_return[1] * 100).toFixed(1)}%`;

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_HOST_TEST}/bet_opportunities/${id}`);
      onDelete(id);
    } catch (err) {
      console.error("Error deleting bet opportunity", err);
    }
  };

  // Navigate to the details page
  const goToDetails = () => {
    navigate(`/bet_opportunity/${id}`);
  };

  return (
    <Container>
      <DeleteButton onClick={handleDelete}>X</DeleteButton>
      <Title onClick={goToDetails}>{question}</Title> {/* Make the title clickable */}
      <MarketContainer>
        <Market {...market_1} />
        <Market {...market_2} />
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
