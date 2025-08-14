function formatDateForMySQL(dateValue){
    if (dateValue instanceof Date){
        return dateValue.toISOString.split('T')[0];
    }
    if (typeof dateValue === 'string'){
        const [day, month, year] = dateValue.split('-');
        return `${year}-${month}-${day}`;
    }
    return null;
}

export default formatDateForMySQL;