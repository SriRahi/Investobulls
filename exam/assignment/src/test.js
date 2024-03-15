import React, { useState, useEffect } from 'react';

const StockTable = () => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [selectedSymbols, setSelectedSymbols] = useState([]);
  const targetPoints = [0, 0.25, 0.5, 0.75, 1]; 

  useEffect(() => {
    fetch("https://intradayscreener.com/api/openhighlow/cash")
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          const updatedItems = result.map(item => ({
            ...item,
            momentum: Array.from({ length: getRandomNumber(2, 4) }, () => Math.floor(Math.random() * 500) + 1) // Generate random number of momentum values
          }));
          setItems(updatedItems);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [])

  const handleCheckboxChange = (symbol) => {
    if (selectedSymbols.includes(symbol)) {
      setSelectedSymbols(selectedSymbols.filter(item => item !== symbol));
    } else {
      setSelectedSymbols([...selectedSymbols, symbol]);
    }
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <table border="1px solid black" borderCollapse="collapse" width="100%">
        <thead>
          <tr>
            <th style={{ backgroundColor: "skyblue" }}>Select</th>
            <th style={{ backgroundColor: "skyblue" }}>Symbol</th>
            <th style={{ backgroundColor: "skyblue" }}>LTP</th>
            <th style={{ backgroundColor: "skyblue" }}>Momentum</th>
            <th style={{ backgroundColor: "skyblue" }}>Open</th>
            <th style={{ backgroundColor: "skyblue" }}>Deviation from Pivot</th>
            <th style={{ backgroundColor: "skyblue" }}>Today's range</th>
            <th style={{ backgroundColor: "skyblue" }}>OHL</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.symbol}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedSymbols.includes(item.symbol)}
                  onChange={() => handleCheckboxChange(item.symbol)}
                />
              </td>
              <td style={{ color: "skyblue", fontWeight: "bold" }}>{item.symbol}</td>
              <td>{item.ltp}</td>
              <td>
                {item.momentum.map((value, index) => (
                  <span key={index} style={{
                    color: "green",
                    backgroundColor: "lightgreen",
                    padding: "2px 5px",
                    borderRadius: "10px",
                    marginRight: "5px",
                    display: "inline-block",
                    marginBottom: "5px"
                  }}>{value}</span>
                ))}
              </td>
              <td>{item.open}</td>
              <td>
                <input
                  type="range"
                  min={item.low}
                  max={item.high}
                  value={item.range} 
                  step="0.01"
                  style={{
                    '--range-color': 'blue', 
                    width: '100%',
                    background: 'linear-gradient(to right, var(--range-color), var(--range-color)) no-repeat',
                    height: '4px',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                />
              </td>
              <td>
                <input
                  type="range"
                  min={-5} 
                  max={5} 
                  value={item.deviationFromPivot} 
                  step="0.01"notepad
                  style={{
                    '--range-color': 'green', 
                    width: '100%',
                    background: 'linear-gradient(to right, var(--range-color), var(--range-color)) no-repeat',
                    height: '4px',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                />
              </td>
              <td style={{
                backgroundColor: item.ltp > 1000 ? "green" : "red",
                color: "white",
                fontWeight: "bold",
                textAlign: "center"
              }}>
                {item.openHighLowSignal}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  function getRandomValue(min, max) {
    return (Math.random() * (max - min) + min).toFixed(2);
  }

  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

export default StockTable;
