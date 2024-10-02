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
  chatId
}: {
  setUserPropmt: (value: string) => void;
  chatId: string
}) => {
  const [question, setQuestion] = useState('');
  const theme = useTheme();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadSuccess, setuploadSuccess] = useState(false);

  const handleButtonClick = () => {
    if (fileInputRef) fileInputRef.current?.click(); // Trigger click on the file input
  };

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();

  //     reader.onload = async () => {
  //       const base64String = reader.result as string; // Get the result as a string

  //       // Now you can send the base64String to your backend
  //       await uploadFile(base64String);
  //     };

  //     reader.readAsDataURL(file); // Read the file as a data URL (Base64)
  //   }
  // };

  async function uploadPDF(file: any) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`http://localhost:5000/rag/upload-pdf/${chatId}`, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Upload successful:', result);
    } else {
      console.error('Upload failed');
    }
  }

  // const uploadFile = async (base64String: string) => {
  //   try {
  //     const response = await fetch('http://localhost:5000/upload', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ file: base64String })
  //     });

  //     const data = await response.json();

  //     setuploadSuccess(true);
  //     setTimeout(()=> setuploadSuccess(false), 2000);

  //   } catch (error) {
  //     console.error('Error uploading file:', error);
  //   }
  // };

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
          {uploadSuccess ? <CloudDoneIcon /> : <CloudUploadIcon />}
        </IconButton>
        <IconButton onClick={() => creatConversation()} color='primary'>
          <SendIcon />
        </IconButton>
      </div>
      <input
        type='file'
        accept='application/pdf'
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          uploadPDF(event.target.files?.[0])
        }
      />
    </div>
  );
};

export default PromptField;
