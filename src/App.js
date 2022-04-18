import logo from './logo.svg';
import './App.css';
import DataTable from './DataTable.js';
import EditSection from './EditSection.js';

import { useState, useReducer } from 'react';


function MockAPI() {
    let data =  [
        {
            id: 1, exercise: 'squat', sets: [{reps:1, weight:5}, {sets:2, reps:10}, {sets:2, reps:10}], date: "4/2/2022", notes: "felt ok"
        },
        {
            id: 2, exercise: 'squat', sets: [{reps: 5, weight:10}], date: "4/5/2022"
        },
        {
            id: 3, exercise: 'deadlift', sets: [{reps: 5, weight:10}], date: "4/7/2022", notes: "x"
        }
    ];
    return data;
}

function dataReducer(data, action) {
    console.log(data, action)
    switch (action.type) {
        case 'added': {
            return [...data, action.rowData];
        }
        case 'deleted': {
            return data.filter(row => row.id !== action.id);
        }
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
        {name: "Date", field: "date" }, 
        {name: 'Exercise', field: "exercise"},
        {name: "Sets", field: "sets" }, 
        {name: "Notes", field: "notes"}
    ];

    console.log('table render')
    let initialData = MockAPI();
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

    return (
        <>
            <EditSection onAddRow={addRow} onEditRow={editRow} rows={data} currId={currId} changeSelection={changeSelection}></EditSection>
            <DataTable columns={columns} rows={data} onDeleteRow={deleteRow} changeSelection={changeSelection}></DataTable>
        </>
    );
}


let nextId = 0;

export default App;
