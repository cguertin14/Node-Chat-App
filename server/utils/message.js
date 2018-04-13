// Export generateMessage function.
export const generateMessage = (from, text) => {
    return {
        from, 
        text,
        createdAt: new Date().getTime()
    };
};