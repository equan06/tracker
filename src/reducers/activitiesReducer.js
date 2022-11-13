export const activitiesState = {
    ERROR_LOADING : 'ERROR_LOADING',
    LOADING : 'LOADING',
    LOADED : 'LOADED',   
    DELETED : 'DELETED',
    EDITED : 'EDITED',
    ADDED : 'ADDED',
}

export function activitiesReducer(state, action) {
    console.log(state, action);
    switch (action.type) {
        case activitiesState.ERROR_LOADING: {
            return { ...state, isError: true, isLoading: false};
        }
        case activitiesState.LOADING: {
            return { ...state, isError: false, isLoading: true };
        }
        // Load entire datasource
        case activitiesState.LOADED: {
            return { ...state, data: action.payload, isError: false, isLoading: false };
        }
        // Append a row
        case activitiesState.ADDED: { // TODO fix rowData being added directly to data's state, vs just pinging the API again
            return {
                ...state,
                data: [...state.data, action.rowData]
            };
        }
        // Delete a row
        case activitiesState.DELETED: {
            console.log(
                action.id
            )
            return {
                ...state, 
                data: state.data.filter(row => row.id !== action.id)
            };
        }
        // Update a row's data
        case activitiesState.EDITED: {
            return {
                ...state,
                data: state.data.map(row => row.id === action.rowData.id ? action.rowData : row)
            };
        }
        default: {
            throw Error(`Unknown action: ${action.type}`);
        }
    }
}