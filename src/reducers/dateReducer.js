import { getStartEndOfWk, getStartEndOfMth } from '../DateUtils.js';

export const timeGran = {
    WEEK: 'weekly',
    MONTH: 'month',
    YEAR: 'year'
};

export const timeGranOptions = [
    {
        value: timeGran.WEEK,
        label: 'Week'
    },
    { 
        value: timeGran.MONTH, 
        label: 'Month'
    },
    // {
    //     value: timeGran.YEAR,
    //     label: 'Year'
    // }
];
export function dateReducer(state, action) {
    let startDate, endDate;
    switch (action.type) {
        case "timeGran_changed": 
            if (action.timeGran === timeGran.MONTH)
                [startDate, endDate] = getStartEndOfMth(state.month, state.year);
            else if (action.timeGran === timeGran.WEEK)
                [startDate, endDate] = getStartEndOfWk(state.date);
            return {
                ...state,
                timeGran: action.timeGran,
                startDate: startDate,
                endDate: endDate
            };
        case "monthYear_changed": 
            [startDate, endDate] = getStartEndOfMth(action.month, action.year);
            console.log(startDate, endDate);
            return {
                ...state,
                month: action.month,
                year: action.year,
                startDate: startDate,
                endDate: endDate
            };
        case "month_changed":
            [startDate, endDate] = getStartEndOfMth(action.month, state.year);
            return {
                ...state,
                month: action.month,
                startDate: startDate,
                endDate: endDate
            };
        case "year_changed":
            [startDate, endDate] = getStartEndOfMth(state.month, action.year);
            return {
                ...state,
                year: action.year,
                startDate: startDate,
                endDate: endDate
            };
        case "week_changed":
            [startDate, endDate] = getStartEndOfWk(action.date);
            return {
                ...state,
                date: action.date,
                startDate: startDate,
                endDate: endDate
            };
        default: {
            throw Error(`Unknown action: ${action.type}`);
        }
    }
}