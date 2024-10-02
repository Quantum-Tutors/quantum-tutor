'use client';
import { Explore, Lightbulb, School } from '@mui/icons-material';
import { Box, Button, Typography, useTheme } from '@mui/material';
import React, { useContext, useEffect } from 'react';
import styles from './page.module.scss';
import FeatureBoxList from '@/components/FeatureBoxList';
import ChatBottom from '@/components/ChatBottom';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { PromptContext } from './layout';

const Page = () => {
  const session = useSession();
  const router = useRouter();

  if (session.status == "unauthenticated") {
    router.push("/")
  }

   const dataContext = useContext(PromptContext);
   console.log("home page Data Context =", dataContext);
   const { chatId } = dataContext;

  useEffect(() => {
    if (chatId) router.push(`/app/${chatId}`);
  }, [chatId]);

  const featureBoxList = [
    { text: 'Learn about socratic learning', Icon: Explore },
    { text: 'Learn DSA', Icon: Lightbulb },
    { text: 'Learn about Object Oriented Programming', Icon: School },
    { text: 'Learn the fundamentals of Programming', Icon: Explore },
  ];
  const theme = useTheme();
  return (
    <Box
      className={styles.wrapper_container}
      sx={{ backgroundColor: "#0e0c16"  }}
    >
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
            {`Hello ${session.data?.user?.name ?? "...."}`}
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
      
      {/* <Button onClick={async () => {
                    await signOut("google")
                }} sx={{ background: '#53c28b', color: 'white', padding: '10px 15px', border: 'none', fontSize: '1.5', borderRadius: '20px' }} className={styles.button}>
                    SignOut
                </Button> */}
    </Box>
  );
};

export default Page;
