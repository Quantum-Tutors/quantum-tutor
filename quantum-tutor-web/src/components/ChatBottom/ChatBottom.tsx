"use client"
import React from 'react'
import PromptField from '@/components/PromptField';
import styles from '../../styles/ChatBottom.module.scss';
import { useTheme } from '@mui/material/styles';

const ChatBottom = () => {
  const theme = useTheme();
  return (
    <div className={styles.bottom} >
      <PromptField />
    </div>
  )
}

export default ChatBottom;
