import React from 'react'
import Image from 'next/image';
import { assets } from '../../../assets';
import styles from '../../styles/UserQuery.module.scss';

const UserQuery = () => {
  return (
    <div className={styles.userQuery}>
      <Image src={assets.User} alt="" width={32} height={32} style={{ borderRadius: "20px" }} />
      <p>Teach me DSA</p>
    </div>
  )
}

export default UserQuery;
