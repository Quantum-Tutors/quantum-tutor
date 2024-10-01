import { createTheme } from '@mui/material/styles';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
			// dark 
      main: '#0e0c16',
    },
    secondary: {
			// light alternative
      main: '#faf7f7',
    },
  },
});

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
			// white
      main: '#f7f7f7',
    },
    secondary: {
			// dark alternative
      main: '#383636',
    },
  },
});