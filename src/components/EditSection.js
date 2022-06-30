import {useEffect, useState} from 'react';
export default function EditSection({ onAddRow, onEditRow, rows, currId, changeSelection }) {
    console.log('EditSection')
    const defaultFormData = {
        date: '',
        exercise: ''
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
                    <label>Name:</label>
                    <input type='text' name='name' value={formData.name} onChange={handleInputChange}></input>
                    <br/>
                    <label>Date: </label>
                    <input type='text' name='date' value={formData.date} onChange={handleInputChange}></input>
                    <br/>
                    <label>Miles: </label>
                    <input type='text' name='miles' value={formData.miles} onChange={handleInputChange}></input>
                    <br/>
                </form> 
            }
        </>
    ) 
}