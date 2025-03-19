// Import files
import * as bcrypt from 'bcrypt';

// Function to generate a hashed value from a plain text string using bcrypt
export const generateHash = ({
    plainText = '',
    salt = parseInt(process.env.SALT_ROUND),
} = {}) => {
    const hash = bcrypt.hashSync(plainText, salt);
    return hash;
};

// Function to compare a plain text value with a hashed value to check for a match
export const compareHash = ({
    plainText = '',
    hashValue = '',
} = {}) => {
    const match = bcrypt.compareSync(plainText, hashValue);
    return match;
}; 