"use client"
import React, { useContext } from 'react'
import Image from 'next/image';
import { assets } from '../../../assets';
import Loader from '../Loader';
import Typography from '@mui/material/Typography';
import { DataContext } from '@/contexts/ExchangeContext';
import styles from '../../styles/ModelResponse.module.scss';
import ResponseAction from '../ResponseAction';

const ModelResponse = () => {
  const dataContext = useContext(DataContext);

  const { data, isLoading } = dataContext;

  return (
    <>
      <div className={styles.modelResponse}>
        <Image src={assets.GeminiIcon} alt='gemini icon' width={30} height={30} />
        {isLoading ?
          <Loader /> :
          <Typography variant="body1" gutterBottom>
            {data?.message}
          </Typography>
        }
      </div>
      <ResponseAction />
    </>
  )
}

export default ModelResponse;
