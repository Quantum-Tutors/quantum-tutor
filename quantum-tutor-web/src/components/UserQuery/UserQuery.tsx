"use client";
import React from 'react'
import { assets } from '../../../assets';
import styles from '../../styles/UserQuery.module.scss';
import Typography from '@mui/material/Typography';

const UserQuery = ({ propmt, imgUrl }: { propmt: string; imgUrl: string }) => {
  
  return (
    <div className={styles.userQuery}>
      <img
        src={imgUrl || assets.User.src}
        alt=''
        width={32}
        height={32}
        style={{ borderRadius: '20px' }}
      />
      <Typography color={"white"} variant='body1' gutterBottom>
        {propmt}
      </Typography>
    </div>
  );
};

export default UserQuery;
