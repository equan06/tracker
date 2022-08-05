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
        value = children.split("T")[0]
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