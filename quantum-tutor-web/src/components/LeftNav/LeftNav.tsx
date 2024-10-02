'use client';
import AddIcon from '@mui/icons-material/Add';
import HelpIcon from '@mui/icons-material/Help';
import MenuIcon from '@mui/icons-material/Menu';
import SchoolIcon from '@mui/icons-material/School';
import SettingsIcon from '@mui/icons-material/Settings';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import * as React from 'react';
import styles from '@/styles/LeftNav.module.scss';
import { useRouter } from 'next/navigation';
import { useTheme } from '@mui/material/styles';
import ModuleList from '../ModuleList';
import { useSession } from 'next-auth/react';

interface Props {
  toggleTheme: () => void;
  setModel: (model: string) => void;
  model: string;
}

const LeftNav = ({ toggleTheme, setModel, model }: Props) => {
  const [open, setOpen] = React.useState(false);
  const [chats, setchats] = React.useState<any[]>([]);
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };
  const [models, setmodels] = React.useState<string[]>([]);

  const router = useRouter();
  const session = useSession();

  React.useEffect(() => {
    const getChats = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LLM_SERVER_URL}/chats/${session.data?.user?.id}`,
        {
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      // get response
      const responseJson = await response.json();
      console.log(responseJson);

      setchats(responseJson);
    };

    const getModels = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LLM_SERVER_URL}/available_models`,
        {
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      // get response
      const responseJson = await response.json();
      console.log(responseJson);

      setmodels(responseJson?.available_models);
    };

    if (!chats.length) getChats();
    getModels();
  }, [session.data?.user?.id]);

  const theme = useTheme();

  const DrawerList = (
    <Box
      sx={{
        width: 250,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
      role='presentation'
    >
      <Typography
        className={styles.chatHeader}
        color={theme.palette.secondary.light}
      >
        Chat History
      </Typography>
      <List>
        {chats?.map((chat: any) => (
          <ListItem key={chat?.chatId} disablePadding>
            <ListItemButton onClick={() => router.push(`/app/${chat?.chatId}`)}>
              <ListItemIcon>
                <SchoolIcon />
              </ListItemIcon>
              <ListItemText
                sx={{ color: theme.palette.secondary.main }}
                primary={chat?.title}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <div className={styles.leftNavBottom}>
        <ModuleList closeNav={()=> setOpen(false)} currentModel={model} setModel={setModel} modules={models} />
      </div>
    </Box>
  );

  return (
    <div style={{ width: 'min-content' }}>
      <IconButton
        onClick={toggleDrawer(true)}
        sx={{ position: 'fixed', zIndex: 100, top: 5, left: 5 }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
          },
          // '& .MuiBackdrop-root': {
          //   backgroundColor: theme.palette.primary.main,
          //   color: theme.palette.primary.main,
          // },
          '& .MuiDrawer-paper': {
            backgroundColor: '#0e0c16', // Custom color
            color: 'grey', // Text color inside the drawer
          },
        }}
        open={open}
        onClose={toggleDrawer(false)}
      >
        <IconButton
          className={styles.toggle}
          onClick={toggleDrawer(false)}
          color='primary'
        >
          <MenuIcon />
        </IconButton>
        <Button
          onClick={() => {
            router.push(`/app/New_chat`);
            setOpen(false);
          }}
          className={styles.newChat}
          variant='contained'
          startIcon={<AddIcon />}
          size='small'
          color='secondary'
        >
          New chat
        </Button>
        {DrawerList}
      </Drawer>
    </div>
  );
};

export default LeftNav;
