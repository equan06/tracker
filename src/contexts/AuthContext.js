import * as React from "react";


const AuthContext = React.createContext({ isAuth: false });
export default AuthContext;

const defaultAuthState = {
    isAuth: false,
}

const AUTH_STATE = "authState";
export function AuthContextProvider({children}) {
    const [authState, setAuthState] = React.useState(() => {
        let state = localStorage.getItem(AUTH_STATE);
        return state !== null ? JSON.parse(state) : defaultAuthState;
    });

    React.useEffect(() => {
        localStorage.setItem(AUTH_STATE, JSON.stringify(authState));
    }, [authState]);

    return (
        <AuthContext.Provider value={{authState, setAuthState}}>
            {children}
        </AuthContext.Provider>
    );
}