// Import files
import CryptoJS from "crypto-js";

// Function to encrypt a plain text string using AES encryption
export const generateEncryption = ({
    plainText = '',
    signature = process.env.ENCRYPTION_SIGNATURE,
} = {}) => {
    const encryption = CryptoJS.AES.encrypt(plainText, signature).toString();
    return encryption;
};

// Function to decrypt an encrypted string using AES decryption
export const decodeEncryption = ({
    cipherText = '',
    signature = process.env.ENCRYPTION_SIGNATURE,
} = {}) => {
    const decrypt = CryptoJS.AES.decrypt(cipherText, signature).toString(CryptoJS.enc.Utf8);
    return decrypt;
};