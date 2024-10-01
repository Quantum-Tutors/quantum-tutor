import React, { useEffect } from 'react';
import ChatContainer from '@/components/ChatContainer';
import { GetChatSession } from './actions';
import {authOptions, loginIsRequiredServer } from '../../../../lib/auth';
import getServerSession from "next-auth"; 
import { redirect, useRouter } from 'next/navigation';

const page = async () => {

  const chatSession = GetChatSession('chat_ea7e32');

  return (
    <>
      <ChatContainer chatSession={chatSession} />
    </>
  );
};

export default page;
