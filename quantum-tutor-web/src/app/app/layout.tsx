'use client';
import { darkTheme, lightTheme } from '@/styles/GlobalTheme';
import LeftNav from 'components/LeftNav';
import * as React from 'react';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import { Theme } from '@mui/material';
import ChatBottom from '@/components/ChatBottom';

type Module = {
  moduleId: string;
  status: boolean;
  message: Array<Message>
};

type Message = {
  msgId: string,
  chatId: string,
  text: string,
  sender: string,
  moduleId: string,
  createdAt: string,
  sequence: number
}

interface IPromptContext {
  data: {
    module: Module
  } | {
    message: Message
  };
  chatId: string;
  prompt: string;
  isLoading: boolean;
}


export const PromptContext =
  React.createContext<IPromptContext>({
    data: {
      message: {
        msgId: '',
        chatId: '',
        text: '',
        sender: '',
        moduleId: '',
        createdAt: '',
        sequence: 0,
      },
    },
    chatId: '',
    prompt: '',
    isLoading: true,
  });

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [theme, setTheme] = React.useState<Theme>(darkTheme);
  const [userPrompt, setUserPrompt] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState(true);
  const [data, setData] = React.useState<any>({});
  const [userChatId, setUserChatId] = React.useState('');

  const makeConversation = async (prompt: string) => {
    setUserPrompt(prompt);
    try {
      const response = await fetch('http://127.0.0.1:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: {
            sender: 'user',
            text: prompt,
            chatId: userChatId,
            // moduleId,
          },
        }),
      });
      console.log('User request body');
      const data = await response.json();
      setData(data);
      console.log(data);
      if (!data?.module){
        setUserChatId(data?.message?.chatId);
      }
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const toggleTheme = () => {
    setTheme(theme === darkTheme ? lightTheme : darkTheme);
  };

  return (
    <ThemeProvider theme={theme}>
      <LeftNav toggleTheme={toggleTheme} />
      <PromptContext.Provider
        value={{
          data: data,
          prompt: userPrompt,
          chatId: userChatId,
          isLoading: isLoading,
        }}
      >
        {children}
      </PromptContext.Provider>
      <ChatBottom setUserPropmt={makeConversation} />
    </ThemeProvider>
  );
}
