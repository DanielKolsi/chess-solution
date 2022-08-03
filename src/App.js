import React from "react";
import Chess from "./components/Chess";


const App = ({ chess }) => {
  return (
    <div>
      <Chess chess={chess} />
    </div>
  );
};

export default App;
