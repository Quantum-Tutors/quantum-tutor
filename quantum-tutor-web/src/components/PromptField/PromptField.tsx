import TextField from '@mui/material/TextField';
import React from 'react'
import styles from '../../styles/PromptField.module.scss';

const PromptField = () => {
  return (
    <TextField
      className={styles.promptField}
      sx={{
        "& .MuiInputBase-root": {
          borderRadius:"25px",
          color: "#fff",
          backgroundColor:"#1e1f20",
        }
      }}
      multiline
      maxRows={4}
      placeholder='Enter what you want to learn about'
    />
  )
}

export default PromptField
