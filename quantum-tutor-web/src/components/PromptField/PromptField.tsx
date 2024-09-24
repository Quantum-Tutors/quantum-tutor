'use client';
import React, { useState } from 'react';
import styles from '@/styles/PromptField.module.scss';
import { useTheme } from '@mui/material/styles';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import IconButton from '@mui/material/IconButton';

const PromptField = ({ setUserPropmt }: { setUserPropmt : (value: string)=> void}) => {
  const [question, setQuestion] = useState('');
  const theme = useTheme();

  const creatConversation = () => {
   setUserPropmt(question);
   setQuestion("");
  };

  return (
    <div className={styles.promptField}>
      <input
        type='text'
        placeholder='Enter a prompt here'
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <div className='search-box-icon'>
        <IconButton color='primary'>
          <AttachFileIcon />
        </IconButton>
        <IconButton onClick={() => creatConversation()} color='primary'>
          <SendIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default PromptField;
