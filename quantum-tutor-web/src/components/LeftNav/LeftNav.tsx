'use client'
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
import { useTheme } from '@mui/material/styles';
interface Props {
  toggleTheme : () => void;
}

const LeftNav = ({ toggleTheme }: Props) => {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const theme = useTheme();

  const DrawerList = (
    <Box sx={{ width: 250 }} role='presentation' onClick={toggleDrawer(false)}>
      <Typography
        className={styles.chatHeader}
        color={theme.palette.secondary.light}
      >
        Chat
      </Typography>
      <List>
        {['Data structures', 'Java', 'React', 'GCP'].map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <SchoolIcon />
              </ListItemIcon>
              <ListItemText
                sx={{ color: theme.palette.secondary.main }}
                primary={text}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <div className={styles.leftNavBottom}>
        <List>
          <ListItem key={'Help'} disablePadding>
            <ListItemButton onClick={() => toggleTheme()}>
              <ListItemIcon>
                <HelpIcon />
              </ListItemIcon>
              <ListItemText
                sx={{ color: theme.palette.secondary.main }}
                primary={'Toggle'}
              />
            </ListItemButton>
          </ListItem>
          <ListItem key={'settings'} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText
                sx={{ color: theme.palette.secondary.main }}
                primary={'Settings'}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </div>
    </Box>
  );

  return (
    <div style={{width: "min-content"}}>
      <IconButton onClick={toggleDrawer(true)} color='primary' sx={{position: "absolute"}}>
        <MenuIcon />
      </IconButton>
      <Drawer
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
          },
          '& .MuiBackdrop-root': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
          },
        }}
        open={open}
        onClose={toggleDrawer(false)}
      >
        <IconButton
          className={styles.toggle}
          onClick={toggleDrawer(false)}
          color="primary"
        >
          <MenuIcon />
        </IconButton>
        <Button
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
