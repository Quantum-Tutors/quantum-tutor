'use client';
import React, { useContext, useEffect } from 'react';
import { PromptContext } from '@/app/app/layout';
import SingleExchange from '../Exchange/SingelExchange';
import ChatHistory from './ChatHistory';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const ChatContainer = ({ chatSession, chatId }: { chatSession: any, chatId: string }) => {
  const dataContext = useContext(PromptContext);
  const session = useSession();
  const router = useRouter();
  console.log(dataContext, chatSession);
  const { data, setData, setChatId, setIsLoading } = dataContext;

  if (session.status === 'unauthenticated') {
    router.push('/');
  }

  useEffect(() => {
    let parsedSession = JSON.parse(chatSession?.value);
    if (parsedSession && data.length === 0) setData(parsedSession);
    console.log(chatId, "chatId");
    setChatId(chatId);
    if(chatId === "newchat") {
      setChatId("")
      router.push("/app")
      setIsLoading(false);
    }
  }, []);

  return <ChatHistory data={data} />;
};

export default ChatContainer;
