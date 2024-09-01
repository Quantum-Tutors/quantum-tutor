"use client";
import { darkTheme, lightTheme } from '@/styles/GlobalTheme';
import ChatContainer from '../../components/ChatContainer';
import LeftNav from '../../components/LeftNav';
import * as React from 'react';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import { Theme } from '@mui/material';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [theme, setTheme] = React.useState<Theme>(darkTheme);

  const toggleTheme = () => {
    setTheme(theme === darkTheme ? lightTheme : darkTheme);
  };

  return (
    <ThemeProvider theme={theme}>
      <LeftNav toggleTheme={toggleTheme} />
      {children }
			<ChatContainer/>
    </ThemeProvider>
  );
}
