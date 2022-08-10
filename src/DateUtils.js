function mod(n, m) {
    return ((n % m) + m) % m;
}

/**
 * Get start/end of week, given date in mm-DD-yyyy
 * @param {*} dateStr 
 * @returns 
 */
export function getStartEndOfWk(dateStr) {
    let date = new Date(dateStr); // assume yyyy-MM-dd format (or most other date formats that are interpreted correctly)
    let currDayOfWk = mod(date.getDay() - 1, 7); 
    let start = date.getDate() - currDayOfWk; // get the start day of the wk
    let startDate = new Date(date.getFullYear(), date.getMonth(), start).toLocaleDateString('en-CA');
    let endDate = new Date(date.setDate(start + 6)).toLocaleDateString('en-CA');
    return [startDate, endDate];
}   
