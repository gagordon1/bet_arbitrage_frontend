import React, { useState, useEffect } from "react";
import { API_HOST_TEST } from "./Constants";
import axios from "axios";
import BetOpportunity from "./BetOpportunity";
import styled from "styled-components";

// Define the structure of bet opportunities
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

interface BetOpportunityData {
  absolute_return: number[];
  last_update: string;
  market_1: Market;
  market_2: Market;
  question: string;
}

const BetOpportunities: React.FC = () => {
  const [betData, setBetData] = useState<BetOpportunityData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);

  const resultsPerPage = 50;

  const fetchBetOpportunities = async (page: number) => {
    setLoading(true);
    try {
      const response = await axios.get(API_HOST_TEST + "/bet_opportunities", {
        params: {
          page_index: page,
          results_per_page: resultsPerPage,
        },
      });

      const { data, next_page_index } = response.data;

      setBetData(data);
      setHasNextPage(next_page_index !== false); // Determine if there's a next page
      setLoading(false);
    } catch (err) {
      setError("Error fetching bet opportunities");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBetOpportunities(pageIndex);
  }, [pageIndex]);

  const handleNextPage = () => {
    if (hasNextPage) {
      setPageIndex(pageIndex + resultsPerPage);
    }
  };

  const handlePreviousPage = () => {
    if (pageIndex > 0) {
      setPageIndex(pageIndex - resultsPerPage);
    }
  };

  return (
    <div>
      <h1>Bet Opportunities</h1>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {!loading && !error && (
        <>
          <OpportunityGrid>
            {betData.map((bet, index) => (
              <BetOpportunity
                key={index}
                question={bet.question}
                absolute_return={bet.absolute_return}
                last_update={bet.last_update}
                market_1={bet.market_1}
                market_2={bet.market_2}
              />
            ))}
          </OpportunityGrid>

          <PaginationContainer>
            <button onClick={handlePreviousPage} disabled={pageIndex === 0}>
              Previous Page
            </button>
            <button onClick={handleNextPage} disabled={!hasNextPage}>
              Next Page
            </button>
          </PaginationContainer>
        </>
      )}
    </div>
  );
};

// Styled Components
const OpportunityGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  /* Media query for smaller screens */
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const PaginationContainer = styled.div`
  margin-top: 20px;
  text-align: center;

  button {
    padding: 10px 15px;
    margin: 5px;
    border: 1px solid #ccc;
    background-color: #f5f5f5;
    cursor: pointer;

    &:disabled {
      background-color: #e0e0e0;
      cursor: not-allowed;
    }
  }
`;

export default BetOpportunities;
