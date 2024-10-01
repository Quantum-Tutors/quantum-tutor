'use client';
import React, { useContext, useEffect, useState } from 'react';
import UserQuery from '../UserQuery';
import ModelResponse from '../ModelResponse';
import styles from '../../styles/Exchange.module.scss';
import { useTheme } from '@mui/material/styles';

const SingleExchange = ({
  sender,
  message
}: {
  sender: string;
  message: string;
}) => {
  const [loading, setloading] = useState<boolean>(true);
  
  useEffect(() => {
    const timeout = setTimeout(()=> setloading(false), 500);
    return () => clearTimeout(timeout);
  }, []);
  
  const theme = useTheme();
  return (
    <div className={styles.exchange}>
      {sender === 'user' ? (
        <UserQuery propmt={message} />
      ) : (
        <ModelResponse text={message} isLoading={loading} />
      )}
    </div>
  );
};

export default SingleExchange;
