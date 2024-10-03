'use client';
import React, { useContext, useEffect, useState } from 'react';
import UserQuery from '../UserQuery';
import ModelResponse from '../ModelResponse';
import styles from '../../styles/Exchange.module.scss';
import { useTheme } from '@mui/material/styles';
import { useSession } from 'next-auth/react';

const SingleExchange = ({
  sender,
  message,
}: {
  sender: string;
  message: string;
}) => {
  const [loading, setloading] = useState<boolean>(true);
  const session = useSession();
  useEffect(() => {
    const timeout = setTimeout(() => setloading(false), 500);
    return () => clearTimeout(timeout);
  }, []);

  const theme = useTheme();
  return (
    <div className={styles.exchange}>
      {sender === 'user' ? (
        <UserQuery imgUrl={session.data?.user?.image || ""} propmt={message} />
      ) : (
        <ModelResponse text={message} isLoading={loading} />
      )}
    </div>
  );
};

export default SingleExchange;
