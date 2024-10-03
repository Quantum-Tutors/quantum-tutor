import React, { useEffect } from 'react';
import ChatContainer from '@/components/ChatContainer';
import { GetChatSession } from './actions';
import styles from "./page.module.scss";

const page = ({ params }: { params: { id: string } }) => {
 
  const chatSession = GetChatSession(params.id);

  return (
    <div
      className={styles.wrapper_container}
      style={{ backgroundColor: '#0e0c16' }}
    >
      <ChatContainer chatSession={chatSession} chatId={params.id} />
    </div>
  );
};

export default page;
