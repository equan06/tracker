import './App.css';
import DataTable from './components/DataTable.js';
import EditSection from './components/EditSection.js';

import { useState, useReducer, useEffect } from 'react';


// TODO https://stackoverflow.com/questions/60618844/react-hooks-useeffect-is-called-twice-even-if-an-empty-array-is-used-as-an-ar

const base_api = 'http://localhost:5000/';

function dataReducer(data, action) {
    console.log(data, action)
    switch (action.type) {
        // Load entire datasource
        case 'loaded': {
            return action.payload;
        }
        // Append a row
        case 'added': {
            return [...data, action.rowData];
        }
        // Delete a row
        case 'deleted': {
            return data.filter(row => row.id !== action.id);
        }
        // Update a row's data
        case 'edited': {
            return data.map(row => row.id === action.rowData.id ? action.rowData : row);
        }
        default: {
            throw Error('Unknown action: ' + action.type)
        }
    }
}


function App() {
    let columns = [
        {name: 'Name', field: 'name'},
        {name: "Date", field: "date" }, 
        {name: 'Miles', field: "miles"},
        {name: "Time", field: "time" }, 
        {name: "Notes", field: "notes"}
    ];

    console.log('table render')
    let initialData = [];
    const [data, dispatch] = useReducer(dataReducer, initialData);
    const [currId, setCurrId] = useState(null);

    if (nextId === 0)
        nextId = 1 + (initialData.length > 0 ? Math.max(...initialData.map(r => r.id)) : 0);

    // reducer: add row, delete row, edit row
    function addRow(rowData) {
        rowData.id = nextId++;
        console.log(rowData)
        dispatch({
            type: 'added',
            rowData: rowData
        });
    }

    function deleteRow(id) {
        dispatch({
            type: 'deleted',
            id: id
        });
    }   
    
    function editRow(rowData) {
        dispatch({
            type: 'edited',
            rowData: rowData
        });
    }

    function changeSelection(newId) {
        setCurrId(newId);
    }

    useEffect(() =>{
        fetch(base_api + 'activities')
        .then(response =>{ return response.json()})
        .then(data => {
            console.log('fetch');
            dispatch({
                type: 'loaded',
                payload: data
            })
        })
        .catch((error) => console.log(error))
    }, []) // empty array = no state/props dependencies, so only runs once on mount

    return (
        <>
            <EditSection onAddRow={addRow} onEditRow={editRow} rows={data} currId={currId} changeSelection={changeSelection}></EditSection>
            <DataTable columns={columns} rows={data} onDeleteRow={deleteRow} changeSelection={changeSelection}></DataTable>
        </>
    );
}


let nextId = 0;

export default App;
