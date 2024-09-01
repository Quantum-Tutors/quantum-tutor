import TextField from '@mui/material/TextField';
import React from 'react'
import styles from '@/styles/PromptField.module.scss';
import { useTheme } from '@mui/material/styles';


const PromptField = () => {

  const theme = useTheme();
  return (
    <TextField
      className={styles.promptField}
      sx={{
        '& .MuiInputBase-root': {
          borderRadius: '25px',
          color: theme.palette.secondary.main,
          backgroundColor: theme.palette.primary.main,
        },
      }}
      multiline
      maxRows={4}
      placeholder='Enter what you want to learn about'
    />
  );
}

export default PromptField
