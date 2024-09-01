import React from 'react'
import Loader from '../Loader';
import { assets } from '../../../assets';
import Image from 'next/image';
import ResponseAction from '../ResponseAction/ResponseAction';
import PromptField from '../PromptField';
import styles from '@/styles/ChatContainer.module.scss';

const ChatContainer = () => {
  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatArea}>
        <div className={styles.userQuery}>
          <Image src={assets.User} alt="" width={32} height={32} style={{borderRadius:"20px"}} />
          <p>Teach me DSA</p>
        </div>
        <div className={styles.modelResponse}>
          <Image src={assets.GeminiIcon} alt='gemini icon' width={30} height={30} />
          <Loader />
        </div>
        <ResponseAction/>
      </div>
      <PromptField />
    </div>
  )
}

export default ChatContainer;
