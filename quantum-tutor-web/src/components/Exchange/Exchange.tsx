"use client"
import React, { useContext, useEffect } from 'react'
import UserQuery from '../UserQuery';
import ModelResponse from '../ModelResponse';
import styles from '../../styles/Exchange.module.scss';
import { useTheme } from '@mui/material/styles';
import { PromptContext } from '@/app/app/layout';

const Exchange = () => {
  const theme = useTheme();
  const dataContext = useContext(PromptContext);
  console.log(dataContext);
  const { data, isLoading, prompt } = dataContext;
  

  
  return (
    <div className={styles.exchange}>
      <UserQuery question={prompt} />
      <ModelResponse data={data} isLoading={isLoading} />
    </div>
  )
}

export default Exchange;
