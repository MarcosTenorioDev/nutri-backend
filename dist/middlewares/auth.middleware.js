"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtValidator = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwks_rsa_1 = __importDefault(require("jwks-rsa"));
async function jwtValidator(req, reply) {
    try {
        const token = req.headers['authorization'];
        const jwtUri = process.env.JWT_PUBLIC_KEY;
        const jwksClientInstance = (0, jwks_rsa_1.default)({
            jwksUri: jwtUri,
        });
        const getKey = (header, callback) => {
            jwksClientInstance.getSigningKey(header.kid, (err, key) => {
                if (err) {
                    console.error('Error getting signing key:', err);
                    callback(err);
                }
                const signingKey = key.getPublicKey();
                callback(null, signingKey);
            });
        };
        const decodedToken = await new Promise((resolve, reject) => {
            jsonwebtoken_1.default.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(decoded);
                }
            });
        });
        const userId = decodedToken.sub;
        req.userId = userId;
        return;
    }
    catch (error) {
        console.error('JWT Verification Error:', error.message);
        throw new Error('Invalid Token');
    }
}
exports.jwtValidator = jwtValidator;
