import axios from "axios";
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { BASEAPI } from '../App.js';
import AuthContext from "../contexts/AuthContext.js";

export default function LoginForm({}) {

    const { setAuthCookie } = React.useContext(AuthContext);

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

    function loginUser(e) {
        e.preventDefault();
        // validate form
        if (loginForm.email === undefined || loginForm.password === undefined)
        {
            console.log("missing username or password");
            return false;
        }
        console.log(loginForm);
        // if valid, authenticate
        axios.post(BASEAPI + "auth", 
            loginForm,
            {
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                withCredentials: true, // allow this request to read/store cookies
            }
        )
        .then(() => {
            // TODO: rework all api requests using axios. fetch error codes are not rejected, only network fail
            // axios promises are rejected for non-200 codes (Same as ajax?)
            // Authentication success
            console.log("auth success");
            setAuthCookie();
            navigate("/activities");
        })
        .catch(error => {
            console.log("auth fail");
            console.log(error);
        });
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
                <button id="submit-button" onClick={loginUser}>Log In</button>
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


