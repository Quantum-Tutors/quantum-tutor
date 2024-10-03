import React from 'react';
import styles from '../../styles/MaintenanceBanner.module.scss';

const MaintenanceBanner = () => {
  return (
    <div className={styles.container}>
        <img src="./maintenance.png" alt="maintenance" />
        <div className={styles.text_container}>
        <h1 className={styles.header}>APP UNDER MAINTENANCE</h1>
        <h4 className={styles.subheader}>We are facing a technical issue and difficulties in deploying our AI model in free tier.</h4>
        </div>
    </div>
  )
}

export default MaintenanceBanner
