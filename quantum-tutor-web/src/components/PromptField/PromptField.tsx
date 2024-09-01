import TextField from '@mui/material/TextField';
import React from 'react'
import styles from '@/styles/PromptField.module.scss';
import { useTheme } from '@mui/material/styles';

import AttachFileIcon from '@mui/icons-material/AttachFile';
import InputAdornment from '@mui/material/InputAdornment';
import SendIcon from '@mui/icons-material/Send';
import { IconButton } from '@mui/material';

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
      InputProps={{
        endAdornment: (
          <InputAdornment position="start">
            <IconButton className={styles.icon} color="primary">
              <AttachFileIcon />
            </IconButton>
            <IconButton className={styles.icon} color="primary">
              <SendIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    >
    </TextField>
  );
}

export default PromptField;
