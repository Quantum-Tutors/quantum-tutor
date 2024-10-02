'use client';
import { Explore, Lightbulb, School, LocalLibrary } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import styles from './page.module.scss';
import FeatureBoxList from '@/components/FeatureBoxList';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { PromptContext } from './layout';
import { usePathname } from 'next/navigation';

const Page = () => {
  const session = useSession();
  const router = useRouter();
  const pathname = usePathname();

  if (session.status == 'unauthenticated') {
    router.push('/');
  }
  const dataContext = useContext(PromptContext);
  const { chatId, isLoading, setIsLoading } = dataContext;

  useEffect(() => {
    if (chatId) {
      setIsLoading(true);
      router.push(`/app/${chatId}`);
    }
  }, [chatId]);

  useEffect(() => {
    const isAppPageWithId = /^\/app\/\d+$/.test(pathname);
    if(isAppPageWithId) setIsLoading(false);
  }, [pathname])
  

  const featureBoxList = [
    { text: 'Learn about socratic learning', Icon: Explore },
    { text: 'Learn DSA', Icon: Lightbulb },
    { text: 'Learn about Object Oriented Programming', Icon: School },
    { text: 'Learn the fundamentals of Programming', Icon: LocalLibrary },
  ];
  const theme = useTheme();

  return (
    <Box
      className={styles.wrapper_container}
      sx={{ backgroundColor: '#0e0c16' }}
    >
      {isLoading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress sx={{ color: 'white' }} />
        </Box>
      ) : (
        <Box className={styles.container}>
          <Box className={styles.welcome_text}>
            <Typography
              sx={{
                fontWeight: '700',
                background: 'linear-gradient(to bottom,  #217bfe, #e55571)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
              component={'div'}
              variant='h2'
              className={styles.greeting}
            >
              {`Hello ${session.data?.user?.name ?? '....'}`}
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
          <FeatureBoxList
            setIsLoading={setIsLoading}
            featureBoxList={featureBoxList}
          />
        </Box>
      )}
    </Box>
  );
};

export default Page;
