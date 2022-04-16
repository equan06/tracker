import {useState} from 'react';
export default function AddSection({onAddRow}) {
    const [isAdding, setIsAdding] = useState(false);
    const defaultFormData = {
        date: '',
        exercise: ''
    }
    const [formData, setFormData] = useState(defaultFormData);

    function toggleAddingMode() {
        setIsAdding(!isAdding);
    }

    function handleInputChange(e) {
        const target = e.target;
        setFormData({
            ...formData,
            [target.name] : target.value
        });
    }

    function handleSave() {
        onAddRow(formData); 
        toggleAddingMode(); 
        setFormData(defaultFormData);
    }

    function handleCancel(){
        toggleAddingMode();
        setFormData(defaultFormData);
    }

    return (
        <>
            {   isAdding ?
                <>
                    <button onClick={handleCancel}>Cancel</button>
                    <button onClick={handleSave}>Save Exercise</button>
                </> :
                <button onClick={toggleAddingMode}>Add Exercise</button> 
            }
            {
                isAdding && 
                <form>
                    <label>Date: </label>
                    <input type='text' name='date' value={formData.date} onChange={handleInputChange}></input>
                    <br/>
                    <label>Exercise: </label>
                    <input type='text' name='exercise' value={formData.exercise} onChange={handleInputChange}></input>
                </form> 
            }
        </>
    ) 
}