"use client"
import React from 'react'
import PromptField from '@/components/PromptField';
import styles from '../../styles/ChatBottom.module.scss';
import { useTheme } from '@mui/material/styles';

const ChatBottom = ({ setUserPropmt }: { setUserPropmt : (value: string)=> void}) => {
  const theme = useTheme();
  return (
    <div
      className={
        theme.palette.mode === 'light'
          ? styles.bottom_white
          : styles.bottom_black
      }
    >
      <PromptField setUserPropmt={setUserPropmt} />
    </div>
  );
};

export default ChatBottom;
