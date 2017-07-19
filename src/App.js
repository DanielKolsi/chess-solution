import React from 'react';
import Chess from './components/Chess';

const App = ({setup}) => {
  return (
    <div>
      <Chess setup={setup}/>
    </div>
  );
}

export default App;
