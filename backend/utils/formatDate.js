function formatDateForMySQL(dateValue){
    if (dateValue instanceof Date){
        const istOffset = 5.5 * 60 * 60 * 1000;
        const istTime = new Date(dateValue.getTime() + istOffset);
        return istTime.toISOString().split('T')[0];
    }
    if (typeof dateValue === 'string'){
        // Handle YYYY-MM-DD format (already correct)
        if (dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
            return dateValue;
        }
        // Handle DD-MM-YYYY format
        const [day, month, year] = dateValue.split('-');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return null;
}

function getCurrentDateIST() {
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istTime = new Date(now.getTime() + istOffset);
    return istTime.toISOString().split('T')[0];
}

export { getCurrentDateIST };

export default formatDateForMySQL;