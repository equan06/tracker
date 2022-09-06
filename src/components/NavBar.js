import * as React from 'react';
import './NavBar.css';

export default function NavBar({}) {
    return (
        <div className="nav-bar">
            <NavButton text="Prev"></NavButton>
            <DateSelector></DateSelector>
            <NavButton text="Next"></NavButton>
        </div>
    );
}


function NavButton({onClick, text}) {
    return (
        <button onClick={onClick}>{text}</button>
    );
}

function DateSelector({}) {
    return (
        <div>
            <label htmlFor="main-date">Week including:</label>
            <input type="date" id="main-date" name="main-date"></input>
        </div>
    );
}