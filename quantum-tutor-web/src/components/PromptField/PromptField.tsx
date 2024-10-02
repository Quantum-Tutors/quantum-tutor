'use client';
import React, { useRef, useState } from 'react';
import styles from '@/styles/PromptField.module.scss';
import { useTheme } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SendIcon from '@mui/icons-material/Send';
import IconButton from '@mui/material/IconButton';
import CloudDoneIcon from '@mui/icons-material/CloudDone';

const PromptField = ({
  setUserPropmt,
}: {
  setUserPropmt: (value: string) => void;
}) => {
  const [question, setQuestion] = useState('');
  const theme = useTheme();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadSuccess, setuploadSuccess] = useState(false);

  const handleButtonClick = () => {
    if (fileInputRef) fileInputRef.current?.click(); // Trigger click on the file input
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = async () => {
        const base64String = reader.result as string; // Get the result as a string
        
        // Now you can send the base64String to your backend
        await uploadFile(base64String);
      };

      reader.readAsDataURL(file); // Read the file as a data URL (Base64)
    }
  };

  const uploadFile = async (base64String: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_LLM_SERVER_URL}/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ file: base64String }),
      });

      const data = await response.json();
      
      setuploadSuccess(true);
      setTimeout(()=> setuploadSuccess(false), 2000);

    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const creatConversation = () => {
    setUserPropmt(question);
    setQuestion('');
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
        <IconButton color='primary' onClick={handleButtonClick}>
          { uploadSuccess ? <CloudDoneIcon/> : <CloudUploadIcon />}
        </IconButton>
        <IconButton onClick={() => creatConversation()} color='primary'>
          <SendIcon />
        </IconButton>
      </div>
      <input
        type='file'
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default PromptField;
