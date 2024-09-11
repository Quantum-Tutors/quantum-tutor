"use client"
import { createContext, useEffect, useState } from 'react';

interface ExchangeContextType {
  data: any;
  isLoading: boolean;
}

const initialState: ExchangeContextType = {
  data: {
    message: 'init',
  },
  isLoading: true,
}
const DataContext = createContext<ExchangeContextType>(initialState);

function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<any>({message: "init"});
  const [isLoading, setIsLoading] = useState(true);

  // const fetchData = async (body: any) => {
  //   setIsLoading(true);
  //   try {
  //     const response = await fetch('https://your-api-endpoint', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ text }),
  //     });
  //     const data = await response.json();
  //     setData(data);
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  useEffect(() => {
    const fetchData = async () => {
      setTimeout(() => {
        setData({ message: 'A data structure is a particular way of organizing data in a computer so that it can be used efficiently. They are essential for writing efficient algorithms. The choice of a data structure affects the performance of algorithms, particularly in terms of speed and memory use.' });
        setIsLoading(false);
      }, 100);
    };

    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{data,isLoading}}>
      {children}
    </DataContext.Provider>
  );
}

export { DataContext, DataProvider };
