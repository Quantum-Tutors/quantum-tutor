import React from 'react';
import styles from '../../styles/MaintenanceBanner.module.scss';

const MaintenanceBanner = () => {
  return (
    <div className={styles.container}>
        <img src="./maintenance.png" alt="maintenance" />
        <div className={styles.text_container}>
        <h1 className={styles.header}>RAG Feature is UNDER MAINTENANCE</h1>
        <h4 className={styles.subheader}>We've reached the storage limit in our DB, on Free tier. Hence our RAG feature isn't working on the live website. Sorry for the inconvenience.</h4>
        </div>
    </div>
  )
}

export default MaintenanceBanner
