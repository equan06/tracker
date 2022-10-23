import * as React from "react";
import styled from "styled-components";

const Dropdown = styled.div`
    position: relative;
`;

const Menu = styled.ul`
    position: absolute;
    list-style-type: none;
    margin: 5px 0;
    padding: 0;

    border: 1px solid grey;
    width: 150px;

`;

const MenuItem = styled.li`
    margin: 0;
    background-color: white;

    &:hover: {
        background-color: lightgray;
    }

    button {
        width: 100%;
        height: 100%;
        text-align: left;
      
        background: none;
        color: inherit;
        border: none;
        padding: 5px;
        margin: 0;
        font: inherit;
        cursor: pointer;
    }
`;

// const menutest = [<button onClick={() => {console.log("test1")}}>Test1</button>, <button onClick={() => {console.log("test2")}}>Test2</button>]
export default function DropdownMenu({trigger, menu}) {
    const [isOpen, setIsOpen] = React.useState(false);
    function handleOpen() {
        setIsOpen(!isOpen);
    }
    // TODO: remove the open state after clicking out of the Menu
    // TODO: have the menu aligned right instead of left
    // TOOD: rewrite using navlink instead of MenuItem
    return (
        <Dropdown>
            {
                React.cloneElement(trigger, { onClick: handleOpen })
            }
            {
                isOpen ?
                (
                    <Menu>
                        {menu.map((menuItem, index) => (
                            <MenuItem key={index}>
                                { React.cloneElement(menuItem, 
                                    {
                                        onClick: () => {
                                            menuItem.props.onClick();
                                            // setIsOpen(false);
                                        }
                                    }
                                )}
                            </MenuItem>
                        ))}
                    </Menu>
                ) : null 
            }
        </Dropdown>
    );
}