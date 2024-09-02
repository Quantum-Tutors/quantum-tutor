import React from 'react'
import styles from '../../styles/ChatContainer.module.scss';
import ModelResponse from '../ModelResponse';
import Module from '../Module';
import ResponseAction from '../ResponseAction';
import UserQuery from '../UserQuery';

const ChatContainer = () => {
  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatArea}>
        <br />
        <div>
          <UserQuery />
          <ModelResponse />
          <ResponseAction />
        </div>
        <Module />
        <Module />
        <Module />
        <br />
        <br />
        <br />
        <br />
      </div>
    </div>
  )
}

export default ChatContainer;
