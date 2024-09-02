import React from 'react'
import Image from 'next/image';
import { assets } from '../../../assets';
import Loader from '../Loader';
import styles from '../../styles/ModelResponse.module.scss';

const ModelResponse = () => {
  return (
    <div className={styles.modelResponse}>
      <Image src={assets.GeminiIcon} alt='gemini icon' width={30} height={30} />
      <Loader />
    </div>
  )
}

export default ModelResponse;
