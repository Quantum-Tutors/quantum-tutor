"use client"
import React, { useContext, useEffect } from 'react'
import UserQuery from '../UserQuery';
import ModelResponse from '../ModelResponse';
import styles from '../../styles/Exchange.module.scss';
import { useTheme } from '@mui/material/styles';
import { MessageT } from '@/types';
import { useSession } from 'next-auth/react';

const Exchange = ({ conversation, isLoading }: { conversation : MessageT, isLoading: boolean}) => {
  const theme = useTheme();
  const session = useSession();

  return (
    <div className={styles.exchange}>
      {conversation?.sender === 'user' ? (
        <UserQuery imgUrl={session.data?.user?.image || ""} propmt={conversation.text} />
      ) : (
        <ModelResponse text={conversation.text} isLoading={isLoading} />
      )}
    </div>
  );
};

export default Exchange;
