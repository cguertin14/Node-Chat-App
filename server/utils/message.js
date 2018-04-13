import moment from 'moment';

// Export generateMessage function.
export const generateMessage = (from, text) => {
    return {
        from, 
        text,
        createdAt: moment().valueOf()
    };
};

// Export generateLocationMessage function.
export const generateLocationMessage = (from, latitude, longitude) => {
    return {
        from,
        url: `https://www.google.com/maps?q=${latitude},${longitude}`,
        createdAt: moment().valueOf()
    };
};