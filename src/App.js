import './App.css';
import DataTable from './components/DataTable.js';
import EditSection from './components/EditSection.js';

import { useState, useReducer, useEffect } from 'react';

// TODO - on server code error, it currently crashes. change to return an error code w/ msg
// TODO https://stackoverflow.com/questions/60618844/react-hooks-useeffect-is-called-twice-even-if-an-empty-array-is-used-as-an-ar

const base_api = 'http://localhost:5000/';

const ERROR_LOADING = 1;
const LOADING = 2;
const LOADED = 3;
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
        case 'added': {
            return {
                ...state,
                data: [...state.data, action.rowData]
            };
        }
        // Delete a row
        case 'deleted': {
            return {
                ...state, 
                data: state.data.filter(row => row.id !== action.id)
            };
        }
        // Update a row's data
        case 'edited': {
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


function App() {
    let columns = [
        {name: 'Name', field: 'name',},
        {name: 'Date', field: 'date', dataType: 'date' }, 
        {name: 'Miles', field: 'miles'},
        {name: 'Time', field: 'time' }, 
        {name: 'Notes', field: 'notes'}
    ];

    console.log('table render')
    let initialState = {
        data: [],
        isLoading: false,
        isError: false
    };
    const [activities, dispatchActivities] = useReducer(dataReducer, initialState);
    const [currId, setCurrId] = useState(null);

    // reducer: add row, delete row, edit row
    function addRow(rowData) {
        fetch(base_api + 'activities', {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json'},
            body: JSON.stringify(rowData)
        })
        .then(response =>{ 
            return response.json()
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
        
            console.log(error)
        });
    }

    // TODO delete api
    function deleteRow(id) {
        dispatchActivities({
            type: 'deleted',
            id: id
        });
    }   
    
    // TODO put api 
    function editRow(rowData) {
        dispatchActivities({
            type: 'edited',
            rowData: rowData
        });
    }

    function changeSelection(newId) {
        setCurrId(newId);
    }

    useEffect(() =>{
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
        <>
            {
                activities.isLoading && <div>Loading data...</div>
            }
            {
                !activities.isError ?
                    <>
                        <EditSection onAddRow={addRow} onEditRow={editRow} rows={activities.data} currId={currId} changeSelection={changeSelection}></EditSection>
                        <DataTable columns={columns} rows={activities.data} onDeleteRow={deleteRow} changeSelection={changeSelection}></DataTable>
                    </>
                :
                <div> Error Loading </div>
            }
        </>
    );
}

export default App;