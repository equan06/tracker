import * as React from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
const AuthContext = React.createContext(getAuthCookie());
export default AuthContext;

export function AuthContextProvider({children}) {
    const [authState, setAuthState] = React.useState(getAuthCookie());
    
    const setAuthCookie = () => {
        setAuthState(getAuthCookie());
    }
    
    const navigate = useNavigate();

    const logoutUser = () => {
        Cookies.remove("sid");
        setAuthState(null); // TODO: clear the sessions out of DB
        navigate("/login");
    }

    const axiosAuth = axios.create({
        baseURL: "http://localhost:5000",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        withCredentials: true
    });
    
    axiosAuth.interceptors.response.use(
        response => {
            console.log(response);
            return response;
        },
        error => {
            console.log(error);
            if (error.response.status === 401) {
                logoutUser();
            }
            return Promise.reject(error.message);
        }
    );

    return (
        <AuthContext.Provider value={{authState, setAuthCookie, logoutUser, axiosAuth}}>
            {children}
        </AuthContext.Provider>
    );
}



export function getAuthCookie() {
    let session = Cookies.get("sid");
    console.log(session);
    if (session === undefined) {
        return null;
    }
    return session;
}