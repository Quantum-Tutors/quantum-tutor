import React from 'react';
import styles from '@/styles/Loader.module.scss';


const Loader = () => {
  return (
    <>
      <div className={styles.loader}>
        <hr className={styles.loaderHr} />
        <hr className={styles.loaderHr} />
        <hr className={styles.loaderHr} />
      </div>
    </>
  );
};

export default Loader;
