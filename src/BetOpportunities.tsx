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
  id: string;
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
  const [sortOption, setSortOption] = useState<string>("none"); // Sort option state

  const resultsPerPage = 50;

  // Fetch bet opportunities with sorting
  const fetchBetOpportunities = async (page: number, sort: string) => {
    setLoading(true);
    try {
      const response = await axios.get(API_HOST_TEST + "/bet_opportunities", {
        params: {
          page_index: page,
          results_per_page: resultsPerPage,
          sort: sort === "none" ? undefined : sort, // If 'none', don't send the sort param
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
    fetchBetOpportunities(pageIndex, sortOption);
  }, [pageIndex, sortOption]);

  // Handle refresh data from the server
  const refreshBetOpportunities = async () => {
    setLoading(true);
    try {
      // Call the refresh endpoint
      await axios.post(`${API_HOST_TEST}/refresh_bet_opportunities`);
      // After refreshing, re-fetch the data
      fetchBetOpportunities(pageIndex, sortOption);
    } catch (err) {
      setError("Error refreshing bet opportunities");
      setLoading(false);
    }
  };

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

  // Handle delete from child component
  const handleDelete = (id: string) => {
    setBetData(betData.filter(bet => bet.id !== id)); // Remove the deleted bet from the state
  };

  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
    setPageIndex(0); // Reset to the first page when the sort option changes
  };

  return (
    <div>
      <HeaderContainer>
        <h1>Bet Opportunities</h1>
        <HeaderActions>
          <SortContainer>
            <label htmlFor="sort">Sort By:</label>
            <select id="sort" value={sortOption} onChange={handleSortChange}>
              <option value="none">None</option>
              <option value="parity_return">Return</option>
            </select>
          </SortContainer>
          <RefreshButton onClick={refreshBetOpportunities}>Refresh</RefreshButton>
        </HeaderActions>
      </HeaderContainer>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {!loading && !error && (
        <>
          <OpportunityGrid>
            {betData.map((bet, index) => (
              <BetOpportunity
                key={index}
                id={bet.id}  // Pass the id down
                question={bet.question}
                absolute_return={bet.absolute_return}
                last_update={bet.last_update}
                market_1={bet.market_1}
                market_2={bet.market_2}
                onDelete={handleDelete}  // Pass the delete handler
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
const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 20px;
`;

const SortContainer = styled.div`
  display: flex;
  align-items: center;

  select {
    margin-left: 10px;
    padding: 5px;
  }
`;

const RefreshButton = styled.button`
  padding: 5px 10px;
  border: 1px solid #ccc;
  background-color: #f5f5f5;
  cursor: pointer;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const OpportunityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr); /* Mobile: 1 column */
  gap: 20px; /* Spacing between the items */

  /* Medium screens: 2 columns */
  @media (min-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }

  /* Large screens: 4 columns */
  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr); /* 4 columns on desktop */
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
