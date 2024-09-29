import React, { useEffect } from 'react';
import ChatContainer from '@/components/ChatContainer';
import { GetChatSession } from './actions';

const page = () => {
  
  const chatSession = GetChatSession('chat_ea7e32');

  return (
    <>
      <ChatContainer chatSession={chatSession} />
    </>
  );
};

export default page;
