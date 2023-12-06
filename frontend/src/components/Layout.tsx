import { Box } from '@mui/material';
import Header from './Header';

const Layout: React.FC = (props) => {

    return <Box>
        <Header />
        {props.children}
    </Box>;
}

export default Layout;