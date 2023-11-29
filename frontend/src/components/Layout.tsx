import Header from './Header';

const Layout: React.FC = (props) => {

    return <div>
        <Header />
        {props.children}
    </div>;
}

export default Layout;