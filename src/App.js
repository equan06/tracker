import * as React from 'react';
import {
    BrowserRouter,
    Routes,
    Route,
    Link,
} from "react-router-dom";

import Activities from './routes/Activities';
import LoginForm from './routes/Login';
import NavBar from './components/NavBar';
import styled from 'styled-components';

const routes = [
    { name: 'Home', path: '/', component: () => <Home /> },
    { name: 'Activities', path: '/activities', component: () => <Activities /> },
];

const Main = styled.main`
    max-width: 1264px;
    width: 100%;
    margin: 0 auto;
`;
export default function App() {
    return (
        <BrowserRouter>
            <NavBar routes={routes}/>
            <Content />
        </BrowserRouter>
    );
}


// Keep in mind - this kind of definition only makes sense if all routes defined are in the NavBar.

// There may be many pages not accessible from the navbar. Then there may be an argument for just defining everything manually...

function Content() {
    return (
        <Main>
            <Routes>
                {
                    routes.map((route, index) => {
                        return (
                            <Route key={index} path={route.path} element={route.component()}></Route>
                        );
                    })
                }
                <Route path={"/login"} element={<LoginForm />}></Route>
            </Routes>
        </Main>
    );
}


function Home() {
    return (<h2>Home Page</h2>);
}