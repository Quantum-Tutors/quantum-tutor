'use client';
import React, { useContext, useEffect } from 'react';
import UserQuery from '../UserQuery';
import ModelResponse from '../ModelResponse';
import styles from '../../styles/Exchange.module.scss';
import { useTheme } from '@mui/material/styles';
import { MessageT } from '@/types';

const SingleExchange = ({
  conversation,
  propmt,
  isLoading,
}: {
  conversation: MessageT;
  propmt: string;
  isLoading: boolean;
}) => {
  const theme = useTheme();
  console.log('exchange', conversation);

  return (
    <div className={styles.exchange}>
        <UserQuery propmt={propmt} />
        <ModelResponse text={conversation.text} isLoading={isLoading} />
    </div>
  );
};

export default SingleExchange;
