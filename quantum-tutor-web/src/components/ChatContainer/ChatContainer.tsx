import React from 'react'
import PromptField from '../PromptField';
import styles from '../../styles/ChatContainer.module.scss';

const ChatContainer = () => {
  return (
    <div className={styles.chatContainer}>
      <PromptField/>
    </div>
  )
}

export default ChatContainer;
