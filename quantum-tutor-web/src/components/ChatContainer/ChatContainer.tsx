import Image from 'next/image';
import React from 'react'
import { assets } from '../../../assets';
import styles from '../../styles/ChatContainer.module.scss';
import Loader from '../Loader';
import PromptField from '../PromptField';
import ResponseAction from '../ResponseAction';
import UserQuery from '../UserQuery';
import ModelResponse from '../ModelResponse';
import Module from '../Module';

const ChatContainer = () => {
  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatArea}>
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
      <PromptField />
    </div>
  )
}

export default ChatContainer;
