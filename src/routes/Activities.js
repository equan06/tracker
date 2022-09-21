import './Activities.css';
import DataTable from '../components/DataTable.js';
import EditSection from '../components/EditSection.js';
import Toolbar from '../components/Toolbar.js';
import Metrics from '../components/Metrics.js';
import { getStartEndOfWk, getStartEndOfMth } from '../DateUtils.js';

import * as React from 'react';

// TODO - on server code error, it currently crashes. change to return an error code w/ msg


const base_api = 'http://localhost:5000/';

// TODO: put these in an object or smth
const ERROR_LOADING = 'ERROR_LOADING';
const LOADING = 'LOADING';
const LOADED = 'LOADED';   
const DELETED = 'DELETED';
const EDITED = 'EDITED';
const ADDED = 'ADDED';

const today = new Date().toLocaleDateString('en-CA');

function activitiesReducer(state, action) {
    console.log(state, action);
    switch (action.type) {
        case ERROR_LOADING: {
            return { ...state, isError: true, isLoading: false};
        }
        case LOADING: {
            return { ...state, isError: false, isLoading: true };
        }
        // Load entire datasource
        case LOADED: {
            return { ...state, data: action.payload, isError: false, isLoading: false };
        }
        // Append a row
        case ADDED: { // TODO fix rowData being added directly to data's state, vs just pinging the API again
            return {
                ...state,
                data: [...state.data, action.rowData]
            };
        }
        // Delete a row
        case DELETED: {
            console.log(
                action.id
            )
            return {
                ...state, 
                data: state.data.filter(row => row.id !== action.id)
            };
        }
        // Update a row's data
        case EDITED: {
            return {
                ...state,
                data: state.data.map(row => row.id === action.rowData.id ? action.rowData : row)
            };
        }
        default: {
            throw Error(`Unknown action: ${action.type}`);
        }
    }
}

export const timeGran = {
    WEEK: 'weekly',
    MONTH: 'month',
    YEAR: 'year'
};

export const timeGranOptions = [
    {
        value: timeGran.WEEK,
        label: 'Week'
    },
    { 
        value: timeGran.MONTH, 
        label: 'Month'
    },
    // {
    //     value: timeGran.YEAR,
    //     label: 'Year'
    // }
];
export const defaultMonth = new Date().getMonth();
export const defaultYear = new Date().getFullYear();

function Activities() {
    let columns = [
        {name: 'Name', field: 'name',},
        {name: 'Date', field: 'date', dataType: 'date' }, 
        {name: 'Miles', field: 'miles'},
        {name: 'Time', field: 'time', dataType: 'seconds'}, 
        {name: 'Notes', field: 'notes'}
    ];

    console.log('table render')
    let initialState = {
        data: [],
        isLoading: false,
        isError: false
    };
    const [activities, dispatchActivities] = React.useReducer(activitiesReducer, initialState);
    const [currId, setCurrId] = React.useState(null);

    const [dateRange, setDateRange] = React.useState({
        startDate: undefined,
        endDate: undefined
    });

    const [dateSelection, setDateSelection] = React.useState({
        timeGran: timeGran.WEEK,
        date: today,
        month: defaultMonth,
        year: defaultYear
    });

    React.useEffect(() => {
        let startDate, endDate;
        switch (dateSelection.timeGran) {
            case timeGran.WEEK:
                [startDate, endDate] = getStartEndOfWk(dateSelection.date);
                break;
            case timeGran.MONTH:
                [startDate, endDate] = getStartEndOfMth(dateSelection.month, dateSelection.year);
            default:
                break;
        }
        console.log(startDate, endDate);
        setDateRange({
            startDate: startDate,
            endDate: endDate
        });
    }, [dateSelection]);

    function addRow(rowData) {
        fetch(base_api + 'activities', {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(rowData)
        })
        .then(response =>{ 
            return response.json();
        })
        .then(data =>{
            console.log('POST', data)
            // TODO? run GET to obtain the resource instead of modifying in memory object?
            // eg if server updates the date/time.
            rowData['id'] = data;
            dispatchActivities({
                type: ADDED,
                rowData: rowData
            });
        })
        .catch(error => {
            console.log(error);
        });
    }

    function deleteRow(id) {
        fetch(`${base_api}activities/${id}`, {
            method: 'DELETE',
        })
        .then(() => {
            // On successful deletion from DB, update state
            console.log('DELETE successful');
            dispatchActivities({
                type: DELETED,
                id: id
            });
        })
        .catch(error=> {
            console.log(error);
        });
    }   
    
    function editRow(rowData) {
        const id = rowData.id;
        fetch(`${base_api}activities/${id}`, {
            method: 'PUT',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(rowData)
        })
        .then(() => {
            console.log('PUT successful');
            dispatchActivities({
                type: EDITED,
                rowData: rowData
            });
        })
        .catch(error => {
            console.log(error);
        });
    }

    function changeSelection(newId) {
        setCurrId(newId);
    }

    // Main data retrieval effect
    // TODO: this should not run until after the default date is set. Currently it runs once on mount with empty params,
    // then runs again after the dateRange is set
    React.useEffect(() => {
        dispatchActivities({
            type: LOADING
        });
        const searchParams = new URLSearchParams();
        if (dateRange.startDate !== undefined)
            searchParams.append('startDate', dateRange.startDate);
        if (dateRange.endDate !== undefined)
            searchParams.append('endDate', dateRange.endDate);
        console.log('GET to ' + base_api + 'activities?' + searchParams)
        fetch(base_api + 'activities?' + searchParams)
        .then(response =>{ return response.json()})
        .then(data => {
            console.log('fetch');
            dispatchActivities({
                type: LOADED,
                payload: data
            })
        })
        .catch(error => {
            dispatchActivities({
                type: ERROR_LOADING
            });
            console.log(error);
        });
    }, [dateRange]) // empty array = no state/props dependencies, so only runs once on mount

    return (
        <div className="main">
            {
                activities.isLoading && <div>Loading data...</div>
            }
            {
                !activities.isError ?
                <>
                    <Toolbar dateSelection={dateSelection} setDate={setDateSelection}></Toolbar>
                    <div className="table-container">
                        <EditSection onAddRow={addRow} onEditRow={editRow} rows={activities.data} currId={currId} changeSelection={changeSelection}></EditSection>
                        <DataTable columns={columns} rows={activities.data} onDeleteRow={deleteRow} changeSelection={changeSelection}></DataTable>
                    </div>
                    <Metrics data={activities.data}></Metrics>
                </>
                :
                <div> Error Loading </div>
            }
        </div>
    );
}

export default Activities;