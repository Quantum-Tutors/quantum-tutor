"use client";
import { Box, Typography } from '@mui/material';
import styles from 'styles/FeatureBox.module.scss';
import { SvgIconComponent } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

interface Props {
  text: string;
  Icon:  SvgIconComponent;
}

const FeatureBox: React.FC<Props> = ({ text, Icon }) => {
  const theme = useTheme();

  return (
    <Box className={styles.container}>
      <Typography component={'div'} variant='h6' sx={{color:"grey", fontSize:"15px"}}>
        {text}
      </Typography>
      <Box className={styles.icon_box}>
        <Icon className={styles.icon}/>
      </Box>
    </Box>
  );
}

export default FeatureBox;
