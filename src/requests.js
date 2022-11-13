// import axios from "axios";
// import * as React from "react";
// import AuthContext from "./contexts/AuthContext";



// function AxiosWrapper({}) {
//     const { removeAuthCookie } = React.useContext(AuthContext);

//     // memo this
//     const instance = axios.create({
//         baseURL: "http://localhost:5000",
//         headers: {
//             "Accept": "application/json",
//             "Content-Type": "application/json"
//         }
//     });
    
//     instance.interceptors.response.use(
//         response => response,
//         error => {
//             if (error.response.status === 401) {
//                 removeAuthCookie();
                
//             }
//             return error;
//         }
//     );
// }