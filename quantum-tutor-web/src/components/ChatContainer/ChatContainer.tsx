"use client";
import React, { useContext } from 'react';
import styles from '../../styles/ChatContainer.module.scss';
import Module from '../Module';
import Exchange from '../Exchange';
import { PromptContext } from '@/app/app/layout';
import SingleExchange from '../Exchange/SingelExchange';

const ChatContainer = ({ chatSession }: {chatSession: any}) => {
  const dataContext = useContext(PromptContext);
  console.log(dataContext, chatSession);
  const { data, isLoading, setData, prompt } = dataContext;
  let parsedSession = JSON.parse(chatSession?.value);
  if (parsedSession && data.length === 0) setData(parsedSession);

    return (
      <div className={styles.chatContainer}>
        {/* <div className={styles.chatArea}>
        <br />
        {data?.map((d) => {
          console.log(d);

          if (d?.module) {
            return <Module conversation={d?.module} />;
          } else
            return (
              <SingleExchange
                conversation={d?.message}
                propmt={prompt}
                isLoading={isLoading}
              />
            );
        })}
        <br />
        <br />
        <br />
        <br />
      </div> */}
        <div className={styles.chatArea}>
          {data?.map((d) => {
            if (d.moduleId) {
              return <Module conversation={d?.module} />;
            } else {
              return (
                <SingleExchange
                  message={d?.text}
                  sender={d?.sender}
                  isLoading={isLoading}
                />
              );
            }
          })}
        </div>
      </div>
    );
};

export default ChatContainer;
