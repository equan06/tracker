import * as React from 'react';
import './Toolbar.css';

export default function Toolbar({}) {
    return (
        <div className="toolbar">
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