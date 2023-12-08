import { Box } from '@mui/material';
import Header from './Header';
import { SnackbarProvider } from 'notistack';

const Layout: React.FC = (props) => {

    return (<SnackbarProvider maxSnack={3}>
        <Header />
        {props.children}
    </SnackbarProvider>);
}

export default Layout;