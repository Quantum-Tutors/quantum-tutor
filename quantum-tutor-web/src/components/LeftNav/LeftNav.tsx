'use client';
import AddIcon from '@mui/icons-material/Add';
import HelpIcon from '@mui/icons-material/Help';
import MenuIcon from '@mui/icons-material/Menu';
import SchoolIcon from '@mui/icons-material/School';
import SettingsIcon from '@mui/icons-material/Settings';
import { Switch, FormControlLabel } from '@mui/material';
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
import { styled } from '@mui/material/styles';

interface Props {
  toggleTheme: () => void;
  setModel: (model: string) => void;
  model: string;
  setRag: (ragState: boolean) => void;
  ragEnabled: boolean;
  setData: (data: any) => void;
}

const CustomSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase': {
    color: '#e4e1f0', // Red color for off
    '&.Mui-checked': {
      color: '#217bfe', // Green color for on
    },
    '&.Mui-checked + .MuiSwitch-track': {
      backgroundColor: '#217bfe', // Green color for on
    },
  },
  '& .MuiSwitch-track': {
    backgroundColor: '#eae5e5', // Red color for off
  },
}));

const LeftNav = ({
  toggleTheme,
  setRag,
  ragEnabled,
  setModel,
  model,
  setData
}: Props) => {
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
            <ListItemButton
              onClick={() => {
                router.push(`/app/${chat?.chatId}`);
                setOpen(false);
              }}
            >
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
        <ModuleList
          closeNav={() => setOpen(false)}
          currentModel={model}
          setModel={setModel}
          modules={models}
        />
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
            router.push(`/app`);
            setData([]);
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
        <div style={{ textAlign: 'center', paddingTop: '10px' }}>
          <FormControlLabel
            control={
              <CustomSwitch
                checked={ragEnabled}
                onChange={() => setRag(!ragEnabled)}
              />
            }
            label={ragEnabled ? 'Disable RAG' : 'Enable RAG'}
          />
        </div>
        {DrawerList}
      </Drawer>
    </div>
  );
};

export default LeftNav;
