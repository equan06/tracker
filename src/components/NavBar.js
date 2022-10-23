import * as React from 'react';
import styled from 'styled-components';
import DropdownMenu from "./DropdownMenu";

import {
    NavLink, useNavigate
} from "react-router-dom";

import AuthContext from "../contexts/AuthContext";

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
    const { authState, setAuthState } = React.useContext(AuthContext);
    const activeClassName = "underline";
    const navigate = useNavigate();
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
                {
                    authState.isAuth ?  
                        // TODO: extract into a separate profile specific component, style buttons
                        // TODO: use NavLink instead of UL, and create a separate NavDropdown component
                        <DropdownMenu 
                            trigger={<button>Profile</button>}
                            menu={[
                                <button onClick={() => {
                                    navigate("/profiles");
                                }}>My Profile</button>,
                                <button onClick={() =>{ 
                                    setAuthState({...authState, isAuth: false});
                                    navigate("/");
                                }}>Log Out</button>
                            ]}
                        >

                        </DropdownMenu>

                        // <NavUl>
                        //     <NavLink end to={"/profile"} className={({isActive}) => isActive ? activeClassName : undefined}>
                        //         <DropdownMenu trigger={<button>Profile</button>}></DropdownMenu>
                        //     </NavLink>
                        // </NavUl>
                        :
                        <NavUl>
                            <NavLink to={"/login"}>
                                <button onClick={() =>{console.log("login")}}>Log In</button>
                            </NavLink>
                            <NavLink to={"/login"}>
                                <button>Sign Up</button>
                            </NavLink>
                        </NavUl>
                }
        </NavHeader>
    )
}



