// App.tsx
import React from "react";
import { Route, Routes } from "react-router-dom";
import BetOpportunities from "./BetOpportunities";
import BetOpportunityDetails from "./BetOpportunityDetails";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<BetOpportunities />} />
      <Route path="/bet_opportunity/:id" element={<BetOpportunityDetails />} />
    </Routes>
  );
};

export default App;
