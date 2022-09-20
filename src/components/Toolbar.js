import * as React from 'react';
import './Toolbar.css';
import '../DateUtils';
import { addWeeksToDate } from '../DateUtils';
import addWeeks  from 'date-fns/addWeeks';
import addMonths from 'date-fns/addMonths';
import add from 'date-fns/add';

export default function Toolbar({dateSelection, setDate}) {
    function prevDate() {
        modifyDate(false, dateSelection, setDate);
    }

    function nextDate() {
        modifyDate(true, dateSelection, setDate);
    }


    return (
        <div className="toolbar">
            <NavButton text="Prev" onClick={prevDate}></NavButton>
            <DateSelector dateSelection={dateSelection} setDate={setDate}></DateSelector>
            <NavButton text="Next" onClick={nextDate}></NavButton>
        </div>
    );
}

// TODO: add year/month/week view
function modifyDate(isForward, dateSelection, setDate) {
    if (dateSelection.date == undefined) return;

    // Because this is parsing yyyy/MM/dd, it parses using RFC2822, interpreting as local time
    let localDate = new Date(dateSelection.date.replace(/-/g, '\/'));  
    let newDate = addWeeks(localDate, isForward ? 1 : -1);

    setDate({
        ...dateSelection,
        date: newDate.toLocaleDateString("en-ca")
    });
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