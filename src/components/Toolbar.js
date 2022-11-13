import * as React from 'react';
import './Toolbar.css';
import { mod } from '../DateUtils';
import addWeeks  from 'date-fns/addWeeks';

import { timeGran, timeGranOptions, } from "../reducers/dateReducer";
import {defaultMonth, defaultYear } from "../routes/Activities";
export default function Toolbar({dateSelection, dispatchDate}) {
    function prevDate() {
        modifyDate(false, dateSelection, dispatchDate);
    }

    function nextDate() {
        modifyDate(true, dateSelection, dispatchDate);
    }

    console.log("Toolbar");
    return (
        <div className="toolbar">
            <NavButton text="Prev" onClick={prevDate}></NavButton>
            <DateSelector dateSelection={dateSelection} dispatchDate={dispatchDate}></DateSelector>
            <NavButton text="Next" onClick={nextDate}></NavButton>
        </div>
    );
}

// TODO: make prev/next work with months/years
function modifyDate(isForward, dateSelection, dispatchDate) {
    if (dateSelection.date == undefined) return;

    if (dateSelection.timeGran === timeGran.WEEK) {
        // Because this is parsing yyyy/MM/dd, it parses using RFC2822, interpreting as local time
        let localDate = new Date(dateSelection.date.replace(/-/g, '\/'));  
        let newDate = addWeeks(localDate, isForward ? 1 : -1);
        dispatchDate({
            type: "week_changed",
            date: newDate.toLocaleDateString("en-ca")
        });
    }
    else if (dateSelection.timeGran === timeGran.MONTH) {
        let month = parseFloat(dateSelection.month);
        let year = dateSelection.year;
        if (month === 0 && !isForward) {
            year -= 1;
        }
        else if (month === 11 && isForward) {
            year += 1;
        }
        if (month !== -1) {
            month = mod((month + (isForward ? 1 : -1)), 12);
        }
        dispatchDate({
            type: "monthYear_changed",
            month: month,
            year: year
        });
    }
}

function NavButton({onClick, text}) {
    return (
        <button onClick={onClick}>{text}</button>
    );
}

const yearOptions = [];
const thisYear = new Date().getFullYear();
for (let year = thisYear - 5; year < thisYear + 5; year++) {
    yearOptions.push({ 
        value: year, 
        label: year,
    });
}

// Months are 0-indexed........
const monthOptions = [
    { value: -1, label: "Any" }, // TODO implement any
    { value: 0, label: "Jan" },
    { value: 1, label: "Feb" },
    { value: 2, label: "Mar" },
    { value: 3, label: "Apr" },
    { value: 4, label: "May" },
    { value: 5, label: "Jun" },
    { value: 6, label: "Jul" },
    { value: 7, label: "Aug" },
    { value: 8, label: "Sep" },
    { value: 9, label: "Oct" },
    { value: 10, label: "Nov" },
    { value: 11, label: "Dec" }
];


function DateSelector({dateSelection, dispatchDate}) {

    // alright, this could definitely be consolidated
    function handleDateChange(e) {
        const target = e.target;
        dispatchDate({ type: "week_changed", date: target.value });
    }

    function handleYearChange(e) {
        const target = e.target;
        dispatchDate({ type: "year_changed", year: parseFloat(target.value) });
    }

    // TODO: why is the value not already numeric? For year, it is.
    function handleMonthChange(e) {
        const target = e.target;
        dispatchDate({ type: "month_changed", month: parseFloat(target.value) });
    }
    function handleTimeGranChange(e) {
        const target = e.target;
        dispatchDate({
            type: "timeGran_changed", 
            timeGran: target.value
        });
    }

    React.useEffect(() => {
        console.log("dateSelection useEffect")
        if (dateSelection.timeGran === timeGran.WEEK){
            setDateLabelText("including");
        }
        else if (dateSelection.timeGran === timeGran.MONTH)
        {
            setDateLabelText("of");
        }
    }, [dateSelection]);

    const [dateLabelText, setDateLabelText] = React.useState('including');
    console.log(dateSelection);
    return (
        <div>
            <Selector name={"timeGran"} onChange={handleTimeGranChange} options={timeGranOptions}></Selector>
            <label htmlFor="date">{dateLabelText}:</label>
            {
                dateSelection.timeGran === timeGran.WEEK ?
                <input type="date" id="date" name="date" value={dateSelection.date} onChange={handleDateChange}></input> :
                <>
                    <Selector name={"month"} 
                        onChange={handleMonthChange}
                        options={monthOptions}
                        value={dateSelection.month}
                        defaultValue={defaultMonth}></Selector>
                    <Selector name={"year"} 
                        onChange={handleYearChange} 
                        options={yearOptions} 
                        value={dateSelection.year} 
                        defaultValue={defaultYear}></Selector>
                </>
            }
        </div>
    );
}


function Selector({name, onChange, options, value, defaultValue}) {
    return (
        <select name={name} onChange={onChange} value={value} defaultValue={defaultValue}>
            <optgroup>
                {
                    options.map((option) => {
                        return <option 
                            key={option.value} 
                            value={option.value}
                            >{option.label}</option>
                    })
                }
            </optgroup>
        </select>
    );
}