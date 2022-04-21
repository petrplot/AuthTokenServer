import jwt from 'jsonwebtoken';

export default function (user, lifeTimeAccToken = '30m', lifeTimeRefToken = '60d') {
  const accessToken = jwt.sign(user, process.env.SECRET_KEY_ACC, { expiresIn: lifeTimeAccToken });
  const refreshToken = jwt.sign(user, process.env.SECRET_KEY_REF, { expiresIn: lifeTimeRefToken });
  return { accessToken, refreshToken };
}
