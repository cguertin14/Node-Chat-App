// Date testing
import moment from 'moment';


let someTimestamp = moment().valueOf();
console.log(someTimestamp);

let date = moment(1234);
console.log(date.format('h:mm A'));