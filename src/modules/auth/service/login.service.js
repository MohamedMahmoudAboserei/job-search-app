// Import files
import userModel from "../../../db/model/User.model.js";
import { asyncHandler } from "../../../utils/response/error.response.js";
import { successResponse } from "../../../utils/response/success.response.js";
import { compareHash } from "../../../utils/security/hash.security.js";
import { generateToken } from "../../../utils/security/token.security.js";
import { OAuth2Client } from 'google-auth-library';
import * as dbService from '../../../db/db.service.js';
import { roleTypes } from "../../../utils/types/roles.js";
import { providerTypes } from "../../../utils/types/provider.js";

// Login
export const login = asyncHandler(
    async (req, res, next) => {
        const { email, password } = req.body;

        if (!email) return next(new Error('Email is required', { cause: 400 }));

        // Find user by email
        const user = await dbService.findOne({
            model: userModel,
            filter: { email }
        });

        if (!user) return next(new Error(`User not found`, { cause: 404 }));
        if (!user.isConfirmed) return next(new Error(`Email not confirmed`, { cause: 400 }));

        // Verify password against stored hash
        if (!compareHash({ plainText: password, hashValue: user.password })) {
            return next(new Error(`Invalid account`, { cause: 404 }));
        }

        // Role-based token signature selection
        const accessToken = generateToken({
            payload: {
                id: user._id, isLoggedIn: true
            },
            signature: user.role === roleTypes.user ? process.env.USER_ACCESS_TOKEN
                : user.role === roleTypes.admin ? process.env.SYSTEM_ACCESS_TOKEN 
                : user.role === roleTypes.companyOwner ? process.env.companyOwner_ACCESS_TOKEN
                : user.role === roleTypes.companyHR ? process.env.companyHR_ACCESS_TOKEN
                : null,
        });

        // Generate refresh token with extended expiry
        const refreshToken = generateToken({
            payload: {
                id: user._id, isLoggedIn: true
            },
            signature: user.role === roleTypes.user ? process.env.USER_REFRESH_TOKEN
                : user.role === roleTypes.admin ? process.env.SYSTEM_REFRESH_TOKEN
                : user.role === roleTypes.companyOwner ? process.env.companyOwner_REFRESH_TOKEN
                : user.role === roleTypes.companyHR ? process.env.companyHR_REFRESH_TOKEN
                : null,
            expiresIn: "7d"
        });

        return successResponse({
            res, message: 'Login successful', status: 200, data: {
                token: {
                    accessToken,
                    refreshToken
                }
            }
        });
    }
);

// Google OAuth2 Login
export const loginWithGmail = asyncHandler(
    async (req, res, next) => {
        const { idToken } = req.body;

        if (!idToken) return next(new Error('ID token required', { cause: 400 }));

        // Initialize Google OAuth2 client
        const client = new OAuth2Client(process.env.CLIENT_ID);

        // Verify Google ID token validity
        async function verify() {
            const ticket = await client.verifyIdToken({
                idToken,
                audience: process.env.CLIENT_ID,
            });
            const payload = ticket.getPayload();
            return payload;
        }

        // Extract user data from Google payload
        const { email_verified, email, name, picture } = await verify();

        // Validate Google account verification status
        if (!email_verified) return next(new Error('Unverified Google account', { cause: 401 }));

        // Find or create user based on Google profile
        let user = await dbService.findOne({ 
            model: userModel,
            filter: { email }
        })

        // Prevent system provider users from using Google login
        if (user?.provider === providerTypes.system) {
            return next(new Error('In-valid login provider', { cause: 409 }))
        }

        // Create new user if not exists
        if (!user) {
            user = await dbService.create({
                model: userModel,
                data: {
                    confirmEmail: email_verified,
                    email: email,
                    userName: name,
                    image: picture,
                    provider: providerTypes.google
                }
            })
        }

        // Generate access token
        const accessToken = generateToken({
            payload: {
                id: user._id, isLoggedIn: true
            },
            signature: user.role == roleTypes.user
                ?
                process.env.USER_ACCESS_TOKEN
                :
                process.env.SYSTEM_ACCESS_TOKEN,
        });

        // Generate refresh token
        const refreshToken = generateToken({
            payload: {
                id: user._id, isLoggedIn: true
            },
            signature: user.role === roleTypes.user
                ? process.env.USER_REFRESH_TOKEN
                : process.env.SYSTEM_REFRESH_TOKEN,
            expiresIn: "7d"
        });

        return successResponse({
            res,
            message: `Done`,
            status: 200,
            data:{
                token: {
                    accessToken,
                    refreshToken
                }
            }
        });
    }
);