import {useEffect, useState} from 'react';
export default function EditSection({ onAddRow, onEditRow, rows, currId, changeSelection }) {
    console.log('EditSection')
    const defaultFormData = {
        name: '',
        date: new Date().toLocaleDateString('en-ca'),
        miles: 0,
        time: 0,
        notes: '',
    }
    const [formData, setFormData] = useState(defaultFormData);
    const [isEditing, setIsEditing] = useState(false);

    function toggleEditingMode() {
        setIsEditing(!isEditing);
    }

    function handleInputChange(e) {
        const target = e.target;
        setFormData({
            ...formData,
            [target.name] : target.value
        });
    }

    function handleSave() {
        if (formData.id === undefined)
            onAddRow(formData); 
        else 
            onEditRow(formData);

        toggleEditingMode(); 
        setFormData(defaultFormData);
        changeSelection(null);
    }

    function handleCancel(){
        toggleEditingMode();
        setFormData(defaultFormData);
        changeSelection(null);
    }

    // When currId updates, update the formData and the editing mode
    useEffect(() => {
        console.log('useEffect', currId);
        let rowData = currId !== null ? rows.find(r => r.id === currId) : defaultFormData;
        setFormData(rowData);
        setIsEditing(currId !== null);
    }, [currId]);

    return (
        <>
            {   isEditing ?
                <>
                    <button onClick={handleCancel}>Cancel</button>
                    <button onClick={handleSave}>Save Exercise</button>
                </> :
                <button onClick={toggleEditingMode}>Add Exercise</button> 
            }
            {
                isEditing && 
                <form>
                    <InputLabel label='Name' id='name' name='name' value={formData.name} onChange={handleInputChange}></InputLabel>
                    <br/>
                    <InputLabel label='Date' id='date' name='date' type='date' value={formData.date} onChange={handleInputChange}></InputLabel>
                    <br/>
                    <InputLabel label='Miles' id='miles' name='miles' type='number' value={formData.miles} onChange={handleInputChange} ></InputLabel>
                    <br/>
                    <InputLabel label='Notes' id='notes' name='notes' type='textarea' value={formData.notes} onChange={handleInputChange}></InputLabel>
                </form> 
            }
        </>
    ) 
}

function InputLabel({label, id, name, type, value, onChange}) {
    return (
        <>
            <label htmlFor={id}>{label}: </label>
            {
                type !== 'textarea' ?
                <input id={id} name={name} type={type} value={value} onChange={onChange}></input> :
                <textarea id={id} name={name} value={value} onChange={onChange}></textarea>

            }            
        </>
    )
}