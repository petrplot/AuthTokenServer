import jwt from 'jsonwebtoken';
import ApiError from '../error/ApiError.js';

export default function (req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      return next(ApiError.unAuthorize());
    }

    const accessToken = authorizationHeader.split(' ')[1];

    if (!accessToken) {
      return next(ApiError.unAuthorize());
    }

    const userData = jwt.verify(accessToken, process.env.SECRET_KEY_ACC);

    if (!userData) {
      return next(ApiError.unAuthorize());
    }
    req.user = userData;
    next();
  } catch (e) {
    return next(ApiError.unAuthorize());
  }
}
