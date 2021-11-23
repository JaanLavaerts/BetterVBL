export const sortFunction = (a,b) => {  
    var dateA = new Date(a.datumString.split('-').reverse().join('-')).getTime();
    var dateB = new Date(b.datumString.split('-').reverse().join('-')).getTime();
    return dateA > dateB ? 1 : -1;  
}; 

export const isDateInPast = (firstDate) => {
        
    var today = new Date();   
    if (firstDate.setHours(0,0,0,0) - today.setHours(0,0,0,0) >= 0) {
      return false
    }
    return true
  }

export const getKeyByValue = (object, value) => {
  return Object.keys(object).find(key => object[key] === value);
}