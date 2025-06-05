import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#43a047' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          height: '100%'
        },
        body: {
          height: '100%',
          margin: 0,
          padding: 0,
        }
      }
    }
  }
});

export default theme;
