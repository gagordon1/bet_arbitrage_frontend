import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
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
  end_date: string;
}

interface BetOpportunityProps {
  id: string;
  question: string;
  absolute_return: number[];
  annualized_return: number[];
  last_update: string;
  market_1: Market;
  market_2: Market;
  onDelete: (id: string) => void;
}

const BetOpportunity: React.FC<BetOpportunityProps> = ({
  id,
  question,
  absolute_return,
  annualized_return,
  last_update,
  market_1,
  market_2,
  onDelete,
}) => {
  const navigate = useNavigate();

  const yesReturn = `${(absolute_return[0] * 100).toFixed(1)}%`;
  const noReturn = `${(absolute_return[1] * 100).toFixed(1)}%`;
  const yesAnnualReturn = `${(annualized_return[0] * 100).toFixed(1)}%`;
  const noAnnualReturn = `${(annualized_return[1] * 100).toFixed(1)}%`;

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_HOST_TEST}/bet_opportunities/${id}`);
      onDelete(id);
    } catch (err) {
      console.error("Error deleting bet opportunity", err);
    }
  };

  const goToDetails = () => {
    navigate(`/bet_opportunity/${id}`);
  };

  return (
    <Container>
      <DeleteButton onClick={handleDelete}>X</DeleteButton>
      <Title onClick={goToDetails}>{question}</Title>

      <MarketContainer>
        <Market {...market_1} />
        <Market {...market_2} />
      </MarketContainer>

      <EndDateContainer>
        <EndDateText><strong>End Date:</strong> {new Date(market_1.end_date).toLocaleDateString()}</EndDateText>
        <EndDateText><strong>End Date:</strong> {new Date(market_2.end_date).toLocaleDateString()}</EndDateText>
      </EndDateContainer>

      <ReturnTable>
        <thead>
          <tr>
            <TableHeader>Outcome</TableHeader>
            <TableHeader>Return</TableHeader>
            <TableHeader>Annualized Return</TableHeader>
          </tr>
        </thead>
        <tbody>
          <TableRow>
            <TableCell>Yes</TableCell>
            <TableCell>{yesReturn}</TableCell>
            <TableCell>{yesAnnualReturn}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>No</TableCell>
            <TableCell>{noReturn}</TableCell>
            <TableCell>{noAnnualReturn}</TableCell>
          </TableRow>
        </tbody>
      </ReturnTable>
      
      <LastUpdate>Last Update: {new Date(last_update).toLocaleString()}</LastUpdate>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  flex-basis: 48%;
  padding: 5px;
  position: relative;
  border: 1px solid #8b8b83;
  background-color: #eef1f2;
  color: #2d4030;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;

  @media (max-width: 768px) {
    flex-basis: 100%;
  }
`;

const DeleteButton = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  color: red;
  font-size: 0.8rem;
  cursor: pointer;

  &:hover {
    color: darkred;
  }
`;

const Title = styled.h3`
  height: 80px;
  color: #2d4030;
  cursor: pointer;
  margin-bottom: 10px;
`;

const MarketContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const EndDateContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
`;

const EndDateText = styled.p`
  font-size: 0.9em;
  color: #4d5e50;
`;

const ReturnTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
`;

const TableHeader = styled.th`
  color: #4d5e50;
  font-weight: bold;
  border-bottom: 1px solid #8b8b83;
  padding: 10px;
  text-align: center;  /* Center-align header content */
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #8b8b83;
`;

const TableCell = styled.td`
  color: #2d4030;
  padding: 10px;
  border-bottom: 1px solid #8b8b83;
  text-align: center;  /* Center-align cell content */
`;

const LastUpdate = styled.p`
  font-size: 0.9em;
  color: #55675b;
  margin-top: 20px;
`;

export default BetOpportunity;
