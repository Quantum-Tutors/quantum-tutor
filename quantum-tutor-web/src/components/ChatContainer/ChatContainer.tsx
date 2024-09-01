import React from 'react'
import styles from '../../styles/ChatContainer.module.scss';
import Loader from '../Loader';
import PromptField from '../PromptField';
import { assets } from '../../../assets';
import Image from 'next/image';
import ResponseAction from '../ResponseAction/ResponseAction';

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
