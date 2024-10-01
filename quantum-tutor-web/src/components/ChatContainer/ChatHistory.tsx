import React from 'react';
import SingleExchange from '../Exchange/SingelExchange';
import Module from '../Module';
import styles from '../../styles/ChatContainer.module.scss';
import { MessageT } from '@/types';

const SingleMessage = (data: MessageT) => (
  <SingleExchange message={data?.text} sender={data?.sender} />
);

const NewModule = (data: MessageT[]) => (
  <Module conversation={data} />
);

export default function ChatHistory({ data }: { data: MessageT[] }) {

  const renderChatMessages = (messages: MessageT[]) => {
    let result = [];
    let moduleGroup = [];

    for (let i = 0; i < messages.length; i++) {
      const currentMessage = messages[i];

      if (currentMessage?.moduleId) {
        // If it's part of a module, group it
        if (
          moduleGroup.length === 0 ||
          moduleGroup[0].moduleId === currentMessage.moduleId
        ) {
          moduleGroup.push(currentMessage);
        } else {
          // If the moduleId changes, render the previous group and start a new one
          result.push(NewModule(moduleGroup));
          moduleGroup = [currentMessage];
        }
      } else {
        // Render individual message
        if (moduleGroup.length > 0) {
          // Render the module group before rendering the individual message
          result.push(NewModule(moduleGroup));
          moduleGroup = [];
        }
        result.push(SingleMessage(currentMessage));
      }
    }

    // Push the last module group if any
    if (moduleGroup.length > 0) {
      result.push(NewModule(moduleGroup));
    }

    return result;
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatArea}>
				{renderChatMessages(data)}
      </div>
    </div>
  );
}
