'use client';
import React, { useContext, useEffect } from 'react';
import UserQuery from '../UserQuery';
import ModelResponse from '../ModelResponse';
import styles from '../../styles/Exchange.module.scss';
import { useTheme } from '@mui/material/styles';

const SingleExchange = ({
  sender,
  message,
  isLoading,
}: {
  sender: string;
  message: string;
  isLoading: boolean;
}) => {
  const theme = useTheme();
  return (
    <div className={styles.exchange}>
      {sender === 'user' ? (
        <UserQuery propmt={message} />
      ) : (
        <ModelResponse text={message} isLoading={isLoading} />
      )}
    </div>
  );
};

export default SingleExchange;
