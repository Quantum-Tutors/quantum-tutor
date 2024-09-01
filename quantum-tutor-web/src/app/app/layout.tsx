import React from 'react'
import ChatContainer from '../../components/ChatContainer';
import LeftNav from '../../components/LeftNav';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <LeftNav />
      {children }
			<ChatContainer/>
    </>
  );
}
