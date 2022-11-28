import './Activities.css';
import DataTable from '../components/DataTable.js';
import EditSection from '../components/EditSection.js';
import Toolbar from '../components/Toolbar.js';
import Metrics from '../components/Metrics.js';
import { getStartEndOfWk, getStartEndOfMth } from '../DateUtils.js';
import * as React from 'react';
import AuthContext from '../contexts/AuthContext.js';
import {activitiesReducer, activitiesState} from "../reducers/activitiesReducer.js";
import { timeGran, dateReducer } from '../reducers/dateReducer.js';


// TODO - on server code error, it currently crashes. change to return an error code w/ msg
import { BASEAPI } from '../App.js';


export const defaultMonth = new Date().getMonth();
export const defaultYear = new Date().getFullYear();

const columns = [
    {name: 'Name', field: 'name',},
    {name: 'Date', field: 'date', dataType: 'date' }, 
    {name: 'Miles', field: 'miles'},
    {name: 'Time', field: 'time', dataType: 'seconds'}, 
    {name: 'Notes', field: 'notes'}
];
const initialActivities = {
    data: [],
    isLoading: false,
    isError: false
};
const initialDate = {
    timeGran: timeGran.WEEK,
    date: new Date().toLocaleDateString("en-CA"),
    month: defaultMonth,
    year: defaultYear,
};

export default function Activities() {
    console.log('Activities');
    const [activities, dispatchActivities] = React.useReducer(activitiesReducer, initialActivities);
    const [currId, setCurrId] = React.useState(null);
    const [dateSelection, dispatchDates] = React.useReducer(dateReducer, initialDate);

    const { axiosAuth } = React.useContext(AuthContext);

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

        dispatchActivities({
            type: activitiesState.LOADING
        });
        const searchParams = new URLSearchParams();
        if (startDate !== undefined)
            searchParams.append('startDate', startDate);
        if (endDate !== undefined)
            searchParams.append('endDate', endDate);

        console.log('GET to ' + BASEAPI + 'activities?' + searchParams)
        axiosAuth.get(`activities?${searchParams}`)
            .then(response => response.data)
            .then(data => {
                dispatchActivities({
                    type: activitiesState.LOADED,
                    payload: data
                })
            })
            .catch(error => {
                dispatchActivities({
                    type: activitiesState.ERROR_LOADING
                });
            });
    }, [dateSelection]);

    function addRow(rowData) {
        fetch(BASEAPI + 'activities', {
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
                type: activitiesState.ADDED,
                rowData: rowData
            });
        })
        .catch(error => {
            console.log(error);
        });
    }

    function deleteRow(id) {
        fetch(`${BASEAPI}activities/${id}`, {
            method: 'DELETE',
        })
        .then(() => {
            // On successful deletion from DB, update state
            console.log('DELETE successful');
            dispatchActivities({
                type: activitiesState.DELETED,
                id: id
            });
        })
        .catch(error=> {
            console.log(error);
        });
    }   
    
    function editRow(rowData) {
        const id = rowData.id;
        fetch(`${BASEAPI}activities/${id}`, {
            method: 'PUT',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(rowData)
        })
        .then(() => {
            console.log('PUT successful');
            dispatchActivities({
                type: activitiesState.EDITED,
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

    return (
        <div className="main">
            {
                activities.isLoading && <div>Loading data...</div>
            }
            {
                !activities.isError ?
                <>
                    <Toolbar dateSelection={dateSelection} dispatchDate={dispatchDates}></Toolbar>
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