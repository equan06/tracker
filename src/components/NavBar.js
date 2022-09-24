import * as React from 'react';
import styled from 'styled-components';
import {
    NavLink
} from "react-router-dom";

const NavUl = styled.ul`
    display: flex;
    a {
        text-decoration: none;
    }
    li {
        color: red;
        margin: 0 0.8rem;
        font-size: 1.3rem;
        position: relative;
        list-style: none;
    }
    
    .underline {
        text-decoration: underline;
    }
`;

const NavHeader = styled.div`
    max-width: 1264px;
    width: 100%;
    margin: 10px auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export default function NavBar({routes}) {
    const activeClassName = "underline";
    return (
        <NavHeader>
            <div>
                Run Tracker
            </div>
            <nav>
                <NavUl>
                    {
                        routes.map((route, index) => {
                            return (
                                <NavLink end key={index} to={route.path} className={({isActive}) => isActive ? activeClassName : undefined}>
                                    <li>
                                        {route.name}
                                    </li>
                                </NavLink>
                            )
                        })
                    }
                </NavUl>
            </nav>
            <NavUl>
                <NavLink end to={"/profiles"} className={({isActive}) => isActive ? activeClassName : undefined}>
                    <li>Profile</li>
                </NavLink>
                <NavLink to={"/login"}>
                    <button>Log In</button>
                </NavLink>
                <NavLink to={"/login"}>
                    <button>Sign Up</button>
                </NavLink>
            </NavUl>
        </NavHeader>
    )
}



