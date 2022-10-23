import * as React from 'react';
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Activities from './routes/Activities';
import LoginForm from './routes/Login';
import NavBar from './components/NavBar';
import styled from 'styled-components';
import AuthContext, {AuthContextProvider} from "./contexts/AuthContext";

export const BASEAPI = 'http://localhost:5000/';

const routes = [
    { name: 'Home', path: '/' },
    { name: 'Activities', path: '/activities' },
];

const Main = styled.main`
    max-width: 1264px;
    width: 100%;
    margin: 0 auto;
`;
export default function App() {
    return (
        <BrowserRouter>
            <AuthContextProvider>
                <NavBar routes={routes}/>
                <Content />
            </AuthContextProvider>
        </BrowserRouter>
    );
}


// Keep in mind - this kind of definition only makes sense if all routes defined are in the NavBar.

// There may be many pages not accessible from the navbar. Then there may be an argument for just defining everything manually...

function Content() {
    return (
        <Main>
            <Routes>
                <Route path="/" element={<Home/>}></Route>
                <Route path="/activities" element={<PrivateRoute><Activities/></PrivateRoute>}/>
                <Route path="/login" element={<LoginForm />}></Route>
            </Routes>
        </Main>
    );
}


function Home() {
    return (<h2>Home Page</h2>);
}

function PrivateRoute({children}) {
    const {authState} = React.useContext(AuthContext);
    return authState.isAuth ? <>{children}</> : <Navigate replace={true} to="/login"/>
}