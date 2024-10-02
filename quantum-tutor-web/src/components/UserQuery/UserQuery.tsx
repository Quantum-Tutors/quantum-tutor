"use client";
import React from 'react'
import { assets } from '../../../assets';
import styles from '../../styles/UserQuery.module.scss';
import Typography from '@mui/material/Typography';
import { useSession } from 'next-auth/react';

const UserQuery = ({ propmt }: { propmt : string}) => {
  const session = useSession();
  console.log(session.data?.user);
  
  return (
    <div className={styles.userQuery}>
      <img
        src={session.data?.user?.image || assets.User}
        alt=''
        width={32}
        height={32}
        style={{ borderRadius: '20px' }}
      />
      <Typography variant='body1' gutterBottom>
        {propmt}
      </Typography>
    </div>
  );
};

export default UserQuery;
