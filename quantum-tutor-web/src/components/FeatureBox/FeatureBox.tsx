import { Box, Typography } from '@mui/material';
import styles from '../../styles/FeatureBox.module.scss';
import { SvgIconComponent } from '@mui/icons-material';

interface Props {
  text: string;
  Icon:  SvgIconComponent;
}

const FeatureBox: React.FC<Props> = ({ text, Icon }) => {
  return (
    <Box className={styles.container}>
      <Typography component={'div'} variant='h6' className={styles.feature_text}>
        {text}
      </Typography>
      <Box className={styles.icon_box}>
        <Icon className={styles.icon}/>
      </Box>
    </Box>
  );
}

export default FeatureBox;
