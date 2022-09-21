import * as React from 'react';
import './Toolbar.css';
import '../DateUtils';
import { addWeeksToDate } from '../DateUtils';
import addWeeks  from 'date-fns/addWeeks';
import addMonths from 'date-fns/addMonths';
import add from 'date-fns/add';

import { timeGran, timeGranOptions, defaultMonth, defaultYear } from '../routes/Activities';

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

// TODO: make prev/next work with months/years
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

function DateSelector({dateSelection, setDate}) {

    // uhh... refactor into useReducer????
    function handleDateChange(e) {
        const target = e.target;
        if (target.name === "timeGran")
        {
            if (target.value === timeGran.WEEK)
            setDateLabelText("including");
            else if (target.value === timeGran.MONTH) {
                setDateLabelText("of");
            }
        }
        
        const isNumber = target.name === "month" || target.name === "year";
        console.log(target.name, target.value);
        setDate({
            ...dateSelection,
            [target.name]: isNumber ? parseFloat(target.value) : target.value
        });
    }


    const [dateLabelText, setDateLabelText] = React.useState('including')
    console.log(dateSelection.timeGran)
    return (
        <div>
            <Selector name={"timeGran"} onChange={handleDateChange} options={timeGranOptions}></Selector>
            <label htmlFor="date">{dateLabelText}:</label>
            {
                dateSelection.timeGran === timeGran.WEEK ?
                <input type="date" id="date" name="date" value={dateSelection.date} onChange={handleDateChange}></input> :
                <>
                    <Selector name={"month"} 
                        onChange={handleDateChange}
                        options={monthOptions}
                        value={dateSelection.month}
                        defaultValue={defaultMonth}></Selector>
                    <Selector name={"year"} 
                        onChange={handleDateChange} 
                        options={yearOptions} 
                        value={dateSelection.year} 
                        defaultValue={defaultYear}></Selector>
                </>
            }
        </div>
    );
}


function Selector({name, onChange, options, defaultValue}) {
    return (
        <select name={name} onChange={onChange} defaultValue={defaultValue}>
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