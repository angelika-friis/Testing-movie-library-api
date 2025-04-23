import React from 'react';
import { useState } from 'react';

const Counter = () => {
    const [count, setCount] = useState(0);

    return (
        <div>
          <p data-testid="count-value">{count}</p>
          <button onClick={() => setCount(count + 1)}>Öka</button>
        </div>
      );
    };
    
    export default Counter;