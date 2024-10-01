"use client";
import { Box, Button, Typography } from '@mui/material'
import React, { useState } from 'react'
import styles from './page.module.scss'
import Image from 'next/image'
import DashboardImage from '../../public/hero.png'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import { TypeAnimation } from "react-type-animation";


const Dashboard = () => {
    const session = useSession()
    const router = useRouter()
    const [typingStatus, setTypingStatus] = useState("human1");

    console.log(`Login status of user ${session.status} and user email id ${session.data?.user?.email}`)

    if (session.status == "authenticated") {
        router?.push("/app")
    }

    return (
        <div className={styles.homepage}>
            {/* <img src="/orbital.png" alt="" className="orbital" /> */}
            <div className={styles.left}>
                <h1 className={styles.header}>Quantum Tutors</h1>
                <h2>Socratic AI teacher</h2>
                <h3>
                    Supercharge your creativity and productivity with socratic learning.
                </h3>
                <Button onClick={async () => {
                    await signIn("google")
                }} sx={{ background: '#53c28b', color: 'white', padding: '10px 15px', border: 'none', fontSize: '1.5', borderRadius: '20px' }} className={styles.button}>
                    Sign In With Google
                </Button>
            </div>
            <div className={styles.right}>
                <div className={styles.imgContainer}>
                    <div className={styles.bgContainer}>
                        <div className={styles.bg}></div>
                    </div>
                    <img src="/bot.png" alt="" className={styles.bot} />
                    <div className={styles.chat}>
                        <img
                            src={
                                typingStatus === "human1"
                                    ? "/human1.jpeg"
                                    : typingStatus === "human2"
                                        ? "/human2.jpeg"
                                        : "bot.png"
                            }
                            alt=""
                        />
                        <TypeAnimation
                            sequence={[
                                // Same substring at the start will only be typed out once, initially
                                "Human:We produce food for Mice",
                                2000,
                                () => {
                                    setTypingStatus("bot");
                                },
                                "Bot:We produce food for Hamsters",
                                2000,
                                () => {
                                    setTypingStatus("human2");
                                },
                                "Human2:We produce food for Guinea Pigs",
                                2000,
                                () => {
                                    setTypingStatus("bot");
                                },
                                "Bot:We produce food for Chinchillas",
                                2000,
                                () => {
                                    setTypingStatus("human1");
                                },
                            ]}
                            wrapper="span"
                            repeat={Infinity}
                            cursor={true}
                            omitDeletionAnimation={true}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard