import { Order, MarketDetails } from "./BetOpportunityDetails"

function isNullOrNaN(value: number | null): boolean {
    return value === null || isNaN(value);
  }

export const investmentCalculation = (
    yesMarket1Contracts : number,
    noMarket1Contracts : number,
    yesMarket2Contracts : number,
    noMarket2Contracts : number,
    market1 : MarketDetails, 
    market2 : MarketDetails
) =>{
    const market1YesAsks = market1.yesOrderBook.asks
    const market1NoAsks = market1.noOrderBook.asks
    const market2YesAsks = market2.yesOrderBook.asks
    const market2NoAsks = market2.noOrderBook.asks

    let totalCost = 0
    let totalReturn = 0
    const returnOnYes = yesMarket1Contracts + yesMarket2Contracts
    const returnOnNo = noMarket1Contracts + noMarket2Contracts

    for (const [contracts, asks] of [
        [yesMarket1Contracts, market1YesAsks],
        [noMarket1Contracts, market1NoAsks],
        [yesMarket2Contracts, market2YesAsks],
        [noMarket2Contracts, market2NoAsks],        
    ] as [number, Order[]][]){
        let price = getEffectivePrice(contracts, asks) as number
        if (!isNullOrNaN(price)){
            totalCost += price * contracts
        }
    }
    return [returnOnYes / totalCost - 1, returnOnNo / totalCost - 1]
}

export const getEffectivePrice = (contracts: number, asks: Order[]): number | null => {
  let totalContracts = 0;
  let totalCost = 0;

  for (const ask of asks) {
    const availableContracts = ask.size;

    // Determine the number of contracts to purchase from the current order
    const contractsToBuy = Math.min(contracts - totalContracts, availableContracts);
    totalContracts += contractsToBuy;
    totalCost += contractsToBuy * ask.price;

    // If we have enough contracts, break out of the loop
    if (totalContracts >= contracts) {
        console.log(totalCost/ totalContracts)
        return totalCost / totalContracts; // Effective price as weighted average
    }
  }

  // If the available contracts in the order book are insufficient
  return null;
};
