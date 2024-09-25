"use client";
import React, { useContext } from 'react';
import styles from '../../styles/ChatContainer.module.scss';
import Module from '../Module';
import Exchange from '../Exchange';
import { PromptContext } from '@/app/app/layout';
import SingleExchange from '../Exchange/SingelExchange';

const ChatContainer = () => {

  const dataContext = useContext(PromptContext);
  console.log(dataContext);
  const { data, isLoading, prompt } = dataContext;

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatArea}>
        <br />
        {data?.map(d => {
          console.log(d);
          
          if(d?.module){
            return(
              <Module conversation={d?.module} />
            );
          }
          else
            return(
            <SingleExchange conversation={d?.message} propmt={prompt} isLoading={isLoading} />
            )
        })}
        <br />
        <br />
        <br />
        <br />
      </div>
    </div>
  );
};

export default ChatContainer;
