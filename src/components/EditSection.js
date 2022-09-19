import React from 'react';
import './EditSection.css';


export default function EditSection({ onAddRow, onEditRow, rows, currId, changeSelection }) {
    console.log('EditSection')
    const defaultFormData = {
        name: '',
        date: new Date().toLocaleDateString('en-ca'),
        miles: 0,
        time: 0,
        notes: '',
    };
    const [formData, setFormData] = React.useState(defaultFormData);
    const [isEditing, setIsEditing] = React.useState(false);
    const [isFormError, setIsFormError] = React.useState(false);

    function toggleEditingMode() {
        setIsEditing(!isEditing);
    }

    function handleInputChange(e) {
        console.log('handleInputChange', e);
        const target = e.target;
        setFormData({
            ...formData,
            [target.name] : target.value
        });
    }

    function setFormDataDirect(name, value) {
        console.log('setFormDataDirect', name, value);
        setFormData({
            ...formData,
            [name]: value
        });
    }

    function handleSave() {
        if (validateForm(formData)) {
            setIsFormError(false);
            if (formData.id === undefined)
                onAddRow(formData); 
            else 
                onEditRow(formData);
    
            toggleEditingMode(); 
            setFormData(defaultFormData);
            changeSelection(null);

        }
        else {
            setIsFormError(true);
        }
    }

    function handleCancel() {
        toggleEditingMode();
        setFormData(defaultFormData);
        changeSelection(null);
        setIsFormError(false);
    }

    // When currId updates, update the formData and the editing mode
    React.useEffect(() => {
        console.log('useEffect', currId);
        let rowData = currId !== null ? rows.find(r => r.id === currId) : defaultFormData;
        setFormData(rowData);
        setIsEditing(currId !== null);
    }, [currId]);

    React.useEffect(() =>{
        console.log(formData);
    }, [formData])

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
                isEditing && isFormError &&
                <div>Please enter all required fields.</div>
            }
            {
                isEditing && 
                <form className="form">
                    <div className="form-row">
                        <InputLabel width='50%' label='Name' id='name' name='name' value={formData.name} onChange={handleInputChange}></InputLabel>
                        <InputLabel width='50%' label='Date*' id='date' name='date' type='date' value={formData.date} onChange={handleInputChange}></InputLabel>
                    </div>
                    <div className="form-row">
                        <InputLabel width='50%' label='Miles*' id='miles' name='miles' type='number' value={formData.miles} onChange={handleInputChange} ></InputLabel>
                    </div>
                    <div className="form-row">
                        <TimeLabel value={formData.time} onChange={setFormDataDirect}></TimeLabel>
                    </div>
                    <div className="form-row">
                        <InputLabel label='Notes' id='notes' name='notes' type='textarea' value={formData.notes} onChange={handleInputChange}></InputLabel>
                    </div>
                </form> 
            }
        </>
    ) 
}

function validateForm(formData) {
    console.log(formData)
    return !(formData.date == null || formData.miles === 0);
}

function InputLabel({width, label, id, name, type, value, onChange}) {
    let style = {
        width: width ?? '100%',
    };
    return (
        <span style={style}>
            <label htmlFor={id}>{label}: </label>
            {
                type !== 'textarea' ?
                <input id={id} name={name} type={type} value={value} onChange={onChange}></input> :
                <textarea id={id} name={name} value={value} onChange={onChange}></textarea>

            }            
        </span>
    )
}

function TimeLabel({value, onChange}) {

    // Deserialize seconds into HHMMSS
    let sec_num = parseInt(value, 10);
    let hours   = Math.floor(sec_num / 3600);
    let minutes = Math.floor(sec_num / 60) % 60;
    let seconds = sec_num % 60;

    const [time, setTime] = React.useState({
        hr: hours,
        min: minutes,
        sec: seconds
    });

    function handleTimeChange(e) {
        let target = e.target;
        setTime({
            ...time,
            [target.name]: parseInt(target.value)
        });
    }

    React.useEffect(() =>{
        // Update the formData's time property with totalSec
        let totalSec = time.hr * 3600 + time.min * 60 + time.sec;
        onChange('time', totalSec);
    }, [time]);
    

    return ( 
        <div className="time-container">
            <div className="time-input-container label-hr">
                <label className="time-label" htmlFor='hr'>Time: </label>
                <input className="time-input" type='number' name='hr' id='hr' value={time.hr} onChange={handleTimeChange} placeholder='hh'></input>
            </div>
            <div className="time-input-container  label-min">
                <input className="time-input" type='number' name='min' id='min' value={time.min} onChange={handleTimeChange} placeholder='mm'></input>
            </div>
            <div className="time-input-container  label-sec">
                <input className="time-input" type='number' name='sec' id='sec' value={time.sec} onChange={handleTimeChange} placeholder='ss'></input>
            </div>
        </div>
    )

}