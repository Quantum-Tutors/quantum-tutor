'use client';
import { darkTheme, lightTheme } from '@/styles/GlobalTheme';
import LeftNav from 'components/LeftNav';
import * as React from 'react';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import { Box, Button, Theme } from '@mui/material';
import { IPromptContext } from '@/types';
import ChatBottom from '@/components/ChatBottom';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';


export const PromptContext = React.createContext<IPromptContext>({
  data: [{
    msgId: '',
    chatId: '',
    text: '',
    userId: '',
    sender: '',
    moduleId: '',
    createdAt: '',
    sequence: 0,
  }],
  chatId: '',
  prompt: '',
  isLoading: true,
  setData: function (): void {
    throw new Error('Function not implemented.');
  }
});

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [theme, setTheme] = React.useState<Theme>(darkTheme);
  const [userPrompt, setUserPrompt] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState<any[]>([]);
  const [userChatId, setUserChatId] = React.useState(null);

  const makeConversation = async (prompt: string) => {
    // setIsLoading(true);
    setUserPrompt(prompt);
    try {
      const response = await fetch('http://127.0.0.1:5000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: 'user',
          text: prompt,
          chatId: userChatId,
          // moduleId,
        }),
      });
      // get response
      const responseJson = await response.json();
      console.log(
        responseJson
      );

      // add response to array
      if (responseJson?.module?.messages?.length > 0) {
        // module
        setUserChatId(responseJson?.module?.messages[0]?.chatId);
        let flag = false;
        const moduleId = responseJson?.module?.moduleId;
        let updatedData = data.map(
          (d) => {
            if (d?.module?.moduleId === moduleId) {
              let newData = d;
              newData.module.messages.push({
                "chatId": responseJson?.module?.messages[0]?.chatId,
                "sender": "user",
                "text": prompt
              })
              newData.module.messages.push(responseJson?.module?.messages[0]);
              flag = true;
              return newData;
            }
            else return d;
          }
        );
        if (!flag) {
          let tempData = responseJson;
          tempData.module?.messages?.unshift({
            "chatId": responseJson?.module?.messages[0]?.chatId,
            "sender": "user",
            "text": prompt
          });
          updatedData.push(tempData);
        }
        console.log("udpated data", updatedData);

        setData(updatedData);

      } else {
        // normal conversation
        setUserChatId(responseJson?.message?.chatId);
        let messageData = [
          ...data,
          {
            chatId: responseJson?.message?.chatId,
            sender: 'user',
            text: prompt,
          },
          responseJson?.message,
        ];
        setData(messageData);
      }

      console.log(data);
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
      <Box sx={{
      }}>
        <LeftNav toggleTheme={toggleTheme} />
        <PromptContext.Provider
          value={{
            data: data,
            prompt: userPrompt,
            chatId: userChatId,
            setData: setData,
            isLoading: isLoading,
          }}
        >
          {children}
        </PromptContext.Provider>
        <ChatBottom setUserPropmt={makeConversation} />
        <Button
        onClick={async () => {
          await signOut();
        }}
        sx={{
          position:"fixed",
          right:20,
          top: 20,
          background: '#217bfe',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          fontSize: '12px',
          fontWeight:600,
          borderRadius: '12px',
          height:"max-content",
          zIndex: 100
        }}
      >
        Signout
      </Button>

      </Box>
    </ThemeProvider>
  );
}
