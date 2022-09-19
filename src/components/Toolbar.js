import * as React from 'react';
import './Toolbar.css';
import '../DateUtils';
import { addWeeksToDate } from '../DateUtils';

export default function Toolbar({dateSelection, setDate}) {
    function prevDate() {
        if (dateSelection.date == undefined) return;
        let date = new Date(dateSelection.date);
        date = addWeeksToDate(date, -1);
        setDate({
            ...dateSelection,
            date: date.toLocaleDateString("en-ca")
        });
    }

    function nextDate() {
        if (dateSelection.date == undefined) return;
        let date = new Date(dateSelection.date);
        date = addWeeksToDate(date, 1);
        setDate({
            ...dateSelection,
            date: date.toLocaleDateString("en-ca")
        });
    }


    return (
        <div className="toolbar">
            <NavButton text="Prev" onClick={prevDate}></NavButton>
            <DateSelector dateSelection={dateSelection} setDate={setDate}></DateSelector>
            <NavButton text="Next"></NavButton>
        </div>
    );
}


function NavButton({onClick, text}) {
    return (
        <button onClick={onClick}>{text}</button>
    );
}

function DateSelector({dateSelection, setDate}) {
    function handleDateChange(e) {
        console.log('handleDateChange', e);
        const target = e.target;
        setDate({
            ...dateSelection,
            date: target.value
        });
    }
    return (
        <div>
            <label htmlFor="main-date">Week including:</label>
            <input type="date" id="main-date" name="main-date" value={dateSelection.date} onChange={handleDateChange}></input>
        </div>
    );
}