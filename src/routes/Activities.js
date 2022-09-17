import './Activities.css';
import DataTable from '../components/DataTable.js';
import EditSection from '../components/EditSection.js';
import Toolbar from '../components/Toolbar.js';
import Metrics from '../components/Metrics.js';
import { getStartEndOfWk } from '../DateUtils.js';

import * as React from 'react';

// TODO - on server code error, it currently crashes. change to return an error code w/ msg

let x = getStartEndOfWk("8/9/2022");

const base_api = 'http://localhost:5000/';

const ERROR_LOADING = 1;
const LOADING = 2;
const LOADED = 3;   
const DELETED = 4;
const EDITED = 5;
function dataReducer(state, action) {
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
        case 'added': { // TODO fix
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
            throw Error('Unknown action: ' + action.type)
        }
    }
}


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
    const [activities, dispatchActivities] = React.useReducer(dataReducer, initialState);
    const [currId, setCurrId] = React.useState(null);

    const [dateRange, setDateRange] = React.useState({
    });



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
                type: 'added',
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

    React.useEffect(() =>{
        dispatchActivities({
            type: LOADING
        });
        fetch(base_api + 'activities')
        .then(response =>{ return response.json()})
        .then(data => {
            console.log('fetch');
            dispatchActivities({
                type: LOADED,
                payload: data
            })
        })
        .catch(error => 
            {
                dispatchActivities({
                    type: ERROR_LOADING
                });
                console.log(error);
            })
    }, []) // empty array = no state/props dependencies, so only runs once on mount



    console.log(activities);
    return (
        <div className="main">
            {
                activities.isLoading && <div>Loading data...</div>
            }
            <Toolbar></Toolbar>
            {
                !activities.isError ?
                <>
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