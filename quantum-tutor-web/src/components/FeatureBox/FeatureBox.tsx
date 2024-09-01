import { Box, Typography } from '@mui/material';
import {ReactElement, ReactNode} from 'react';
import styles from '../../styles/FeatureBox.module.scss';
import ExploreIcon from '@mui/icons-material/Explore';

interface Props {
  text: string;
  Icon: ReactElement;
}

export default function FeatureBox({text, Icon}: Props) {
  return (
    <Box className={styles.container}>
      <Typography component={'div'} variant='h6' className='feature_text'>
        {text}
      </Typography>
      <Box className={styles.icon_box}>
        <ExploreIcon />
      </Box>
    </Box>
  ); 
}
