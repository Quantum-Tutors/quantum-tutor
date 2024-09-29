"use client"
import { createContext, useEffect, useState } from 'react';

interface Message {
  sender: string;
  text: string;
  chatId: string | null
}

interface Data {
  message: Message;
}

interface ExchangeContextType {
  data: Data;
  isLoading: boolean;
}

const initialState: ExchangeContextType = {
  data: {
    message: {
      sender: "user",
      text: "Hii, hello0000?",
      chatId: "chat_ca925b"
    }
  },
  isLoading: false
};

const DataContext = createContext<ExchangeContextType>(initialState);

function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [userChatId, setUserChatId] = useState(null);

  const initialState: ExchangeContextType = {
    data: {
      message: {
        sender: "user",
        text: "Hii, hello0000?",
        chatId: userChatId
      }
    },
    isLoading: false
  };

useEffect(()=>{
  const fetchData = async (body: any) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      console.log("User request body")
      console.log(body)
      const data = await response.json();
      setData(data);
      data?.message.chatId && setUserChatId(data?.message.chatId)
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  fetchData(initialState.data);
  console.log("Bot Response");
  console.log(data.message);
},[])

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setTimeout(() => {
  //       setData({ message: 'A data structure is a particular way of organizing data in a computer so that it can be used efficiently. They are essential for writing efficient algorithms. The choice of a data structure affects the performance of algorithms, particularly in terms of speed and memory use.' });
  //       setIsLoading(false);
  //     }, 100);
  //   };

  //   fetchData();
  // }, []);

  return (
    <DataContext.Provider value={{data,isLoading}}>
      {children}
    </DataContext.Provider>
  );
}

export { DataContext, DataProvider };
