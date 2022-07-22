import './DataTable.css';

// DataTable is composed of a search, date range selectors, header row, rows for each activity
export default function DataTable({ columns, rows, onDeleteRow, changeSelection }) {
    console.log('DataTable')
    if (rows == null) rows = [];
    return (
        <table>
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
                            onDeleteRow={onDeleteRow}></ActivityRow>
                    })
                }
            </tbody>
        </table>
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