'use client';
import React, { useContext, useEffect } from 'react';
import { PromptContext } from '@/app/app/layout';
import SingleExchange from '../Exchange/SingelExchange';
import ChatHistory from './ChatHistory';

const ChatContainer = ({ chatSession }: { chatSession: any }) => {
  const dataContext = useContext(PromptContext);
  console.log(dataContext, chatSession);
  const { data, isLoading, setData, currentModuleId } = dataContext;

  useEffect(() => {
    let parsedSession = JSON.parse(chatSession?.value);
    if (parsedSession && data.length === 0) setData(parsedSession);
  }, []);

  return <ChatHistory data={data} />;
};

export default ChatContainer;
