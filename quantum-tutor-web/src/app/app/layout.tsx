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
import PromptField from '@/components/PromptField';


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
  moduleList: [],
  prompt: '',
  chatId: "",
  isLoading: true,
  currentModuleId: "",
  setData: function (): void {
    throw new Error('Function not implemented.');
  }
});

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const session = useSession();

  const [theme, setTheme] = React.useState<Theme>(darkTheme);
  const [userPrompt, setUserPrompt] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState<any[]>([]);
  const [userChatId, setUserChatId] = React.useState(null);
  const [moduleIds, setmoduleIds] = React.useState<string[]>([]);
  const [moduleId, setCurrentModuleId] = React.useState("");

  const makeConversation = async (prompt: string) => {
    const userId = await session?.data?.user?.id;
    // setIsLoading(true);
    setUserPrompt(prompt);
    try {
      const response = await fetch(`${process.env.LLM_SERVER_URL}/chat`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: 'user',
          text: prompt,
          chatId: userChatId,
          model: 'llama-3.1-70b-versatile',
          moduleId: moduleIds[moduleIds.length - 1],
          userId: userId,
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
        // current module
        const currentModuleId = responseJson?.module?.moduleId;
        setUserChatId(responseJson?.module?.messages[0]?.chatId);
        setCurrentModuleId(currentModuleId);

        // handle module Ids
        let tempModulesIds = moduleIds
        if (!tempModulesIds.find((moduleId) => moduleId === currentModuleId)) {
          tempModulesIds.push(currentModuleId);
        }
        setmoduleIds(tempModulesIds);

        let messageData = [
          ...data,
          {
            chatId: responseJson?.module?.messages[0]?.chatId,
            sender: 'user',
            text: prompt,
            moduleId: currentModuleId,
            sequence: data[data.length -1 ]?.sequence ? data[data.length -1 ]?.sequence + 1 : 1
          },
          responseJson?.module?.messages[0],
        ];
        setData(messageData);
        
      } else {
        // normal conversation
        setUserChatId(responseJson?.message?.chatId);
        let messageData = [
          ...data,
          {
            chatId: responseJson?.message?.chatId,
            sender: 'user',
            text: prompt,
            sequence: data[data.length -1 ]?.sequence ? data[data.length -1 ]?.sequence + 1 : 1
          },
          responseJson?.message,
        ];
        setData(messageData);
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
      <Box sx={{
        backgroundColor:"#0e0c16"
      }}>
        <LeftNav toggleTheme={toggleTheme} />
        <PromptContext.Provider
          value={{
            data: data,
            prompt: userPrompt,
            setData: setData,
            isLoading: isLoading,
            chatId: userChatId || "",
            moduleList: moduleIds,
            currentModuleId: moduleId
          }}
        >
          {children}
        </PromptContext.Provider>
        <PromptField setUserPropmt={makeConversation} />
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
