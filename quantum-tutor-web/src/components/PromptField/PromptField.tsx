"use client"
import React from 'react'
import styles from '@/styles/PromptField.module.scss';
import { useTheme } from '@mui/material/styles';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import IconButton from '@mui/material/IconButton';

const PromptField = () => {

  const theme = useTheme();
  return (
    <div className={styles.promptField}>
      <input
        type="text"
        placeholder="Enter a prompt here"
      />
      <div className="search-box-icon">
        <IconButton color="primary">
          <AttachFileIcon />
        </IconButton>
        <IconButton color="primary">
          <SendIcon />
        </IconButton>
      </div>
    </div>
  );
}

export default PromptField;
