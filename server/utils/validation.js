// Function to test if string is really a tring and its lenght is greater than 0.
export const isRealString = (str) => {
    return typeof(str) === 'string' && str.trim().length > 0;
};

