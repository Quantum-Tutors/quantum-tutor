"use client"
import React from 'react'
import UserQuery from '../UserQuery';
import ModelResponse from '../ModelResponse';
import styles from '../../styles/Exchange.module.scss';
import { useTheme } from '@mui/material/styles';

const Exchange = () => {
  const theme = useTheme();
  return (
    <div className={styles.exchange}>
      <UserQuery />
      <ModelResponse/>
    </div>
  )
}

export default Exchange;
