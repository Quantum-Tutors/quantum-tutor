import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import styles from './page.module.scss'
import Image from 'next/image'
import DashboardImage from '../../public/hero.png'

const Dashboard = () => {
  return (
    <Box className={styles.container}>
        <Box className={styles.item_left}>
            <Typography sx={{fontWeight: '700', background:'linear-gradient(to bottom, #194c33, #bbb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}} variant='h1' className={styles.dashboard_header}>
                Quantum Tutor
            </Typography>
            <Typography sx={{fontWeight:'600'}} variant='h5' className={styles.dashboard_subheader}>
                Seek knowledge, not answers
            </Typography>
            <Typography sx={{textAlign:'justify',color:'#cdcdcd'}} className={styles.dashboard_body}>
                Chat to start, let's embark on a quest where every question is a step towards enlightenment
            </Typography>
            <Box className={styles.button_container}>
            <Button sx={{background:'#53c28b', color:'white', padding:'10px 15px',border:'none',fontSize:'1.5',borderRadius:'20px'}} className={styles.button}>
                Sign In
            </Button>
            </Box>
        </Box>
        <Box className={styles.item_right}>
            <Image src={DashboardImage} className={styles.img} alt='Dasboard Image'/>
        </Box>
    </Box>
  )
}

export default Dashboard
