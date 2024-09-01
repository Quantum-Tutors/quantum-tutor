import React from 'react'
import ThumbUpOffAltOutlinedIcon from '@mui/icons-material/ThumbUpOffAltOutlined';
import ThumbDownOffAltOutlinedIcon from '@mui/icons-material/ThumbDownOffAltOutlined';
import IconButton from '@mui/material/IconButton';
import styles from '@/styles/ResponseAction.module.scss';
import MoreOption from '../MoreOption';
import { useTheme } from '@mui/material/styles';

const ResponseAction = () => {
  const theme = useTheme();

  return (
    <div className={styles.responseAction}>
      <IconButton size='large'>
        <ThumbUpOffAltOutlinedIcon
          fontSize='inherit'
          style={{ color: theme.palette.primary.main }}
        />
      </IconButton>
      <IconButton size='large'>
        <ThumbDownOffAltOutlinedIcon
          fontSize='inherit'
          style={{ color: theme.palette.primary.main }}
        />
      </IconButton>
      <MoreOption />
    </div>
  );
}

export default ResponseAction
