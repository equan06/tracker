import * as React from "react";
import Cookies from "js-cookie";

const AuthContext = React.createContext(getAuthCookie());
export default AuthContext;

export function AuthContextProvider({children}) {
    const [authState, setAuthState] = React.useState(getAuthCookie());

    const setAuthCookie = () => {
        setAuthState(getAuthCookie());
    }

    const removeAuthCookie= () => {
        Cookies.remove("sid");
        setAuthState(getAuthCookie());
    }

    return (
        <AuthContext.Provider value={{authState, setAuthCookie, removeAuthCookie}}>
            {children}
        </AuthContext.Provider>
    );
}



export function getAuthCookie() {
    let session = Cookies.get("sid");
    console.log(session);
    if (session === undefined) {
        return {};
    }
    return { session_id: session };
}