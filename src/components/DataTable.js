import './DataTable.css';
import * as React from 'react';

// DataTable is composed of a search, date range selectors, header row, rows for each activity
export default function DataTable({ className, columns, rows, onDeleteRow, changeSelection }) {
    console.log('DataTable')
    if (rows == null) rows = [];

    const [confirmDelete, setConfirmDeleteVisible] = React.useState({ isShow: false, id: null });
    let deleteConfirm = function(id) {
        console.log('delete confirm?');
        setConfirmDeleteVisible({ isShow: true, id: id });
    };

    let onConfirm = function() {
        onDeleteRow(confirmDelete.id);
        setConfirmDeleteVisible({ isShow: false, id: null });
    };

    let onCancel = function() {
        setConfirmDeleteVisible({ isShow: false, id: null });
    };

    return (
        <>
            {
                confirmDelete.isShow && <ConfirmDeletePopup onConfirm={onConfirm} onCancel={onCancel}/>
            }
            {
                <table className={className}>
                    <HeaderRow columns={columns}></HeaderRow>
                    <tbody>
                        {
                            rows.map(row => {
                                console.log(row);
                                return <ActivityRow 
                                    key={row.id} 
                                    row={row} 
                                    columns={columns} 
                                    changeSelection={changeSelection}
                                    onDeleteRow={deleteConfirm}></ActivityRow>
                            })
                        }
                    </tbody>
                </table>

            }
        </>
    );
}

function HeaderRow({ columns }) {
    return (
        <thead>
            <tr>
                {
                    columns.map(c => {
                        return <th key={c.name}>{c.name}</th>
                    })
                }
            </tr>
        </thead>
    );
}

function ActivityRow({ row, columns, changeSelection, onDeleteRow }) {
    return (
        <tr>
            {
                columns.map(c => { 
                        return <Cell key={c.field} dataType={c.dataType}>{row[c.field]}</Cell>
                })
            }
            <td>
                <button onClick={() => { changeSelection(row.id) }}>Edit</button>        
                <button onClick={() => { onDeleteRow(row.id) }}>X</button>
            </td>
        </tr>
    );
}

function Cell({dataType, children}) {
    let value = children;
    if (dataType === 'date') {
        value = value.split("T")[0]
    }
    else if (dataType === 'seconds') {
        value = secToHHMMSS(value);
    }

    return (
        <td className="table-cell">
            {value}
        </td>
    )
}

function ConfirmDeletePopup({onConfirm, onCancel}) {
    return (
        <div className='modal'>
            <div className='modal-content'>
                <p>Confirm delete?</p>
                <button onClick={onCancel}>Cancel</button>
                <button className='popup-confirm-button' onClick={onConfirm}>Yes</button>
            </div>
        </div>
    );
}

/**
 * https://stackoverflow.com/questions/1322732/convert-seconds-to-hh-mm-ss-with-javascript 
 * from Santiago Hernandez
 * @param {*} secs 
 * @returns 
 */
function secToHHMMSS(sec) {
    let sec_num = parseInt(sec, 10);
    let hours   = Math.floor(sec_num / 3600);
    let minutes = Math.floor(sec_num / 60) % 60;
    let seconds = sec_num % 60;

    return [hours, minutes, seconds]
        .map(v => v < 10 ? "0" + v : v)
        .filter((v,i) => v !== "00" || i > 0)
        .join(":");
}

/**
 * Convert entered timestamp in HHMMSS to seconds
 * @param {*} dateStr 
 */
function HHMMSStoSec(dateStr) {
    
}