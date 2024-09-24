import React from 'react'
import Image from 'next/image';
import { assets } from '../../../assets';
import styles from '../../styles/UserQuery.module.scss';
import Typography from '@mui/material/Typography';

const UserQuery = ({question}) => {
  
  return (
    <div className={styles.userQuery}>
      <Image
        src={assets.User}
        alt=''
        width={32}
        height={32}
        style={{ borderRadius: '20px' }}
      />
      <Typography variant='body1' gutterBottom>
        {question}
      </Typography>
    </div>
  );
}

export default UserQuery;
