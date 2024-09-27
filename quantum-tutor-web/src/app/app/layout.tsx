'use client';
import { darkTheme, lightTheme } from '@/styles/GlobalTheme';
import LeftNav from 'components/LeftNav';
import * as React from 'react';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import { Theme } from '@mui/material';
import { IPromptContext } from '@/types';
import ChatBottom from '@/components/ChatBottom';


export const PromptContext = React.createContext<IPromptContext>({
  data: [{
    message: {
      msgId: '',
      chatId: '',
      text: '',
      sender: '',
      moduleId: '',
      createdAt: '',
      sequence: 0,
    },
  }],
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
  const [data, setData] = React.useState<any[]>([]);
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
            if(d?.module?.moduleId === moduleId){
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
        if(!flag){
          let tempData = responseJson;
          tempData.module?.messages?.unshift({
            "chatId": responseJson?.module?.messages[0]?.chatId,
            "sender": "user",
            "text": prompt
          });
          updatedData.push(tempData);
        }
        console.log("udpated data",updatedData);
        
        setData(updatedData);

      } else {
        // normal conversation
        setUserChatId(responseJson?.message?.chatId);
        setData([...data, responseJson]);
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
