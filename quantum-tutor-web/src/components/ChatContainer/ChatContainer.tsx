import React, { useContext } from 'react';
import styles from '../../styles/ChatContainer.module.scss';
import { DataProvider } from '../../contexts/ExchangeContext';
import Module from '../Module';
import Exchange from '../Exchange';

const ChatContainer = () => {
  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatArea}>
        <br />
        <Exchange />
        <Module />
        <Module />
        <Module />
        <br />
        <br />
        <br />
        <br />
      </div>
    </div>
  );
};

export default ChatContainer;
