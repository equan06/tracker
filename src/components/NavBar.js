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


export default function NavBar({routes}) {

    const activeClassName = "underline";
    return (
        <>
            <div>
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
            </div>

        </>
    )
}



