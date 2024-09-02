"use client";
import { Box, Typography, useTheme } from '@mui/material';
import React from 'react';
import styles from './page.module.scss';
import FeatureBoxList from '@/components/FeatureBoxList';
import { Explore } from '@mui/icons-material';

const Page = () => {
  const featureBoxList = [
    { text: 'Learn about socratic learning', Icon: Explore },
    { text: 'Learn about socratic learning', Icon: Explore },
    { text: 'Learn about socratic learning', Icon: Explore },
    { text: 'Learn about socratic learning', Icon: Explore },
  ];
  const theme = useTheme();
  return (
    <Box className={styles.wrapper_container} sx={{backgroundColor: theme.palette.primary.light}}>
    <Box className={styles.container} >
      <Box className={styles.welcome_text}>
        <Typography
          sx={{
            fontWeight: '700',
            background: 'linear-gradient(to bottom, #194c33, #bbb)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
          component={'div'}
          variant='h2'
          className={styles.greeting}
        >
          Hello Gary
          <Typography
            sx={{ fontWeight: '700' }}
            component={'div'}
            variant='h3'
            className={styles._subtext}
          >
            Ready To Learn?
          </Typography>
        </Typography>
      </Box>
      <FeatureBoxList featureBoxList={featureBoxList} />
    </Box>
  </Box>
  );
};

export default Page;
