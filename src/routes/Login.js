import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
export default function LoginForm({}) {
    const defaultForm = {
        "email": "",
        "password": ""
    };
    const [loginForm, setLoginForm] = React.useState(defaultForm);
    const navigate = useNavigate();

    function handleFormChange(e) {
        const target = e.target;
        setLoginForm({
            ...loginForm,
            [target.name]: target.value
        });
    }

    function onLogin() {
        // validate form

        // if valid, authenticate

        // if authenticated, redirect
        navigate("/activities");
    }
    return (
        <div>
            <h2>Log In</h2>
            <div>
                Log in with email
            </div>
            <form>
                <InputWithLabel 
                    id={"email"} 
                    name={"email"} 
                    label={"Email"} 
                    placeholder={"Email"} 
                    value={loginForm.email}
                    handleChange={handleFormChange}>
                </InputWithLabel>
                <InputWithLabel 
                    id={"password"} 
                    name={"password"} 
                    label={"Password"} 
                    placeholder={"Password"} 
                    value={loginForm.password}
                    handleChange={handleFormChange}>
                </InputWithLabel>
                <button id="submit-button" onClick={onLogin}>Log In</button>
            </form>

        </div>
    );
}

const InputContainer = styled.div`display: block`;
const BlockLabel = styled.label`display: block`;
const BlockInput = styled.input`display: block`;
function InputWithLabel({name, label, value, placeholder, handleChange}) {
    return (
        <InputContainer>
            <BlockLabel htmlFor={name}>{label}</BlockLabel>
            <BlockInput id={name} name={name} value={value} placeholder={placeholder} onChange={handleChange}></BlockInput>
        </InputContainer>
    )
}


