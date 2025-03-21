// Function to send a standardized success response
export const successResponse = ({ res, message, data, status }) => {
    return res.status(status || 200).json({ successMessage: message, data: {...data} })
};