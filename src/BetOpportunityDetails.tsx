import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import OrderBookChart from "./OrderBookChart";
import { API_HOST_TEST } from "./Constants";
import { investmentCalculation, getEffectivePrice } from "./investmentCalculation";

// Interfaces
export interface Order {
  price: number;
  size: number;
}

export interface MarketOrderBook {
  asks: Order[];
  bids: Order[];
}

export interface MarketDetails {
  platform: string;
  question: string;
  yesOrderBook: MarketOrderBook;
  noOrderBook: MarketOrderBook;
}

// Styled components for layout
const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
`;

const FlexContainer = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const HalfSection = styled.div`
  flex: 1;
  min-width: px;
`;

const Section = styled.div`
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 10px;
  color: #333;
`;

const Label = styled.label`
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
  color: #444;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const Button = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 15px;

  &:hover {
    background-color: #45a049;
  }
`;

const ResultText = styled.p`
  font-size: 16px;
  color: #333;
`;

const EffectivePrice = styled.div`
  margin-top: 15px;
  background-color: #e8f5e9;
  padding: 10px;
  border-radius: 5px;
  color: #2e7d32;
  font-weight: bold;
  text-align: center;
`;

// BetOpportunityDetails Component
const BetOpportunityDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [market1, setMarket1] = useState<MarketDetails | null>(null);
  const [market2, setMarket2] = useState<MarketDetails | null>(null);

  const [contracts, setContracts] = useState({
    yesMarket1Contracts: 0,
    noMarket1Contracts: 0,
    yesMarket2Contracts: 0,
    noMarket2Contracts: 0,
  });

  const [calculatedReturns, setCalculatedReturns] = useState<{ returnOnYes: number | null; returnOnNo: number | null }>({
    returnOnYes: null,
    returnOnNo: null,
  });

  const [effectivePrices, setEffectivePrices] = useState<{
    yesMarket1Price: number | null;
    noMarket1Price: number | null;
    yesMarket2Price: number | null;
    noMarket2Price: number | null;
  }>({
    yesMarket1Price: null,
    noMarket1Price: null,
    yesMarket2Price: null,
    noMarket2Price: null,
  });

  useEffect(() => {
    const fetchOrderBooks = async () => {
      try {
        const { data } = await axios.get(`${API_HOST_TEST}/bet_opportunity/${id}`);
        
        setMarket1({
          platform: data.bet_opportunity.market_1.platform,
          question: data.bet_opportunity.market_1.question,
          yesOrderBook: data.orderbooks.market_1_yes_orderbook,
          noOrderBook: data.orderbooks.market_1_no_orderbook,
        });
        
        setMarket2({
          platform: data.bet_opportunity.market_2.platform,
          question: data.bet_opportunity.market_2.question,
          yesOrderBook: data.orderbooks.market_2_yes_orderbook,
          noOrderBook: data.orderbooks.market_2_no_orderbook,
        });
      } catch (error) {
        console.error("Error fetching order books", error);
      }
    };

    fetchOrderBooks();
  }, [id]);

  const handleContractChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContracts((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const calculateReturns = () => {
    if (market1 && market2) {
      const [returnOnYes, returnOnNo] = investmentCalculation(
        contracts.yesMarket1Contracts,
        contracts.noMarket1Contracts,
        contracts.yesMarket2Contracts,
        contracts.noMarket2Contracts,
        market1,
        market2
      );
      
      const yesMarket1Price = getEffectivePrice(contracts.yesMarket1Contracts, market1.yesOrderBook.asks);
      const noMarket1Price = getEffectivePrice(contracts.noMarket1Contracts, market1.noOrderBook.asks);
      const yesMarket2Price = getEffectivePrice(contracts.yesMarket2Contracts, market2.yesOrderBook.asks);
      const noMarket2Price = getEffectivePrice(contracts.noMarket2Contracts, market2.noOrderBook.asks);
      
      setCalculatedReturns({ returnOnYes, returnOnNo });
      setEffectivePrices({ yesMarket1Price, noMarket1Price, yesMarket2Price, noMarket2Price });
    }
  };

  return (
    <Container>
      <Title>Bet Opportunity Details</Title>
      <Section>
        <p>Question: {market1?.question || market2?.question}</p>
      </Section>

      <FlexContainer>
        {/* Investment Testing Section */}
        <HalfSection>
          <Section>
            <h3>Investment Testing</h3>
            <Label>Yes Contracts for Market 1:</Label>
            <Input
              type="number"
              name="yesMarket1Contracts"
              value={contracts.yesMarket1Contracts}
              onChange={handleContractChange}
            />
            
            <Label>No Contracts for Market 1:</Label>
            <Input
              type="number"
              name="noMarket1Contracts"
              value={contracts.noMarket1Contracts}
              onChange={handleContractChange}
            />
            
            <Label>Yes Contracts for Market 2:</Label>
            <Input
              type="number"
              name="yesMarket2Contracts"
              value={contracts.yesMarket2Contracts}
              onChange={handleContractChange}
            />
            
            <Label>No Contracts for Market 2:</Label>
            <Input
              type="number"
              name="noMarket2Contracts"
              value={contracts.noMarket2Contracts}
              onChange={handleContractChange}
            />
            
            <Button onClick={calculateReturns}>Calculate Investment Returns</Button>

            <ResultText>Return on Yes Contracts: {calculatedReturns.returnOnYes !== null ? `${(calculatedReturns.returnOnYes * 100).toFixed(2)}%` : 'N/A'}</ResultText>
            <ResultText>Return on No Contracts: {calculatedReturns.returnOnNo !== null ? `${(calculatedReturns.returnOnNo * 100).toFixed(2)}%` : 'N/A'}</ResultText>

            {/* Effective Prices */}
            <EffectivePrice>
              <p>Effective Price for Yes Contracts Market 1: {effectivePrices.yesMarket1Price !== null ? `$${effectivePrices.yesMarket1Price.toFixed(2)}` : 'N/A'}</p>
              <p>Effective Price for No Contracts Market 1: {effectivePrices.noMarket1Price !== null ? `$${effectivePrices.noMarket1Price.toFixed(2)}` : 'N/A'}</p>
              <p>Effective Price for Yes Contracts Market 2: {effectivePrices.yesMarket2Price !== null ? `$${effectivePrices.yesMarket2Price.toFixed(2)}` : 'N/A'}</p>
              <p>Effective Price for No Contracts Market 2: {effectivePrices.noMarket2Price !== null ? `$${effectivePrices.noMarket2Price.toFixed(2)}` : 'N/A'}</p>
            </EffectivePrice>
          </Section>
        </HalfSection>

        {/* Market Asks Charts Section */}
        <HalfSection>
          <Section>
            <h3>Market Asks Charts</h3>
            <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
              {market1 && (
                <div style={{ flex: 1 }}>
                  <h4>{market1.platform} - Yes Asks</h4>
                  <OrderBookChart orders={market1.yesOrderBook.asks} label="Yes Asks" color="rgba(75, 192, 75, 0.6)" />
                </div>
              )}
              {market2 && (
                <div style={{ flex: 1 }}>
                  <h4>{market2.platform} - Yes Asks</h4>
                  <OrderBookChart orders={market2.yesOrderBook.asks} label="Yes Asks" color="rgba(75, 192, 75, 0.6)" />
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "20px" }}>
              {market1 && (
                <div style={{ flex: 1 }}>
                  <h4>{market1.platform} - No Asks</h4>
                  <OrderBookChart orders={market1.noOrderBook.asks} label="No Asks" color="rgba(255, 99, 132, 0.6)" />
                </div>
              )}
              {market2 && (
                <div style={{ flex: 1 }}>
                  <h4>{market2.platform} - No Asks</h4>
                  <OrderBookChart orders={market2.noOrderBook.asks} label="No Asks" color="rgba(255, 99, 132, 0.6)" />
                </div>
              )}
            </div>
          </Section>
        </HalfSection>
      </FlexContainer>
    </Container>
  );
};

export default BetOpportunityDetails;
