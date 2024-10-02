'use client';
import React, { useContext, useEffect } from 'react';
import { PromptContext } from '@/app/app/layout';
import SingleExchange from '../Exchange/SingelExchange';
import ChatHistory from './ChatHistory';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const ChatContainer = ({ chatSession }: { chatSession: any }) => {
  const dataContext = useContext(PromptContext);
  const session = useSession();
  const router = useRouter();
  console.log(dataContext, chatSession);
  const { data, isLoading, setData, currentModuleId } = dataContext;

  if(session.status === "unauthenticated")
  {
    router.push("/")
  }
  
  useEffect(() => {
    let parsedSession = JSON.parse(chatSession?.value);
    if (parsedSession && data.length === 0) setData(parsedSession);
  }, []);

  return <ChatHistory data={data} />;
};

export default ChatContainer;
