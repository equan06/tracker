import * as React from 'react';
import {
    BrowserRouter,
    Routes,
    Route,
    Link,
} from "react-router-dom";

import Activities from './routes/Activities';
import NavBar from './components/NavBar';

const routes = [
    { name: 'Home', path: '/', component: () => <Home /> },
    { name: 'Activities', path: '/activities', component: () => <Activities /> }
];

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
        <Routes>
            {
                routes.map((route, index) => {
                    return (
                        <Route key={index} path={route.path} element={route.component()}></Route>
                    );
                })
            }
        </Routes>
    );
}


function Home() {
    return (<h2>Home Page</h2>);
}