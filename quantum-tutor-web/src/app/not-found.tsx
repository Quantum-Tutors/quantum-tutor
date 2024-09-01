'use client';
import React, { useEffect } from 'react'
import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
 
export default function NotFound() {
	
	const router = useRouter();
	 useEffect(() => {
		// return to home page after 6 seconds 
     const timeoutId = setTimeout(() => {
       router.push('/'); 
     }, 6000);

		 return () => {
       clearTimeout(timeoutId);
     };
   }, []);

	return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        height: '100vh',
      }}
    >
      <Image
        src={`/404-error.png`}
        alt={'404-not-found'}
        width='240'
        height='240'
      />
      <br />
      <Typography
        sx={{ width: '80%' }}
        textAlign={'center'}
        component={'div'}
        variant='h5'
        justifyContent={'justify'}
        style={{ color: '#2C2B2B' }}
      >
        Oops, No computations of our Quantum AI could find this Page,
        redirecting to home page ....
      </Typography>
    </Box>
  );
}
