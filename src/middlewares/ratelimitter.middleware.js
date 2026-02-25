import expressRL from 'express-rate-limit';

export const rateLimiter = expressRL({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 50, // limit each IP to 50 requests per windowMs
    message: {
        success: false,
        message: "Too many requests from this IP, please try again after 1 minute",
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});