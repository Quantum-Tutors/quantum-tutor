import React, { useEffect } from 'react';
import ChatContainer from '@/components/ChatContainer';
import { GetChatSession } from './actions';
import {authOptions, loginIsRequiredServer } from '../../../../lib/auth';

const page = ({ params }: { params: { id: string } }) => {
 
  const chatSession = GetChatSession(params.id);

  return (
    <>
      <ChatContainer chatSession={chatSession} />
    </>
  );
};

export default page;
