import bcrypt from 'bcrypt';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import Token from '../models/Token.js';
import ApiError from '../Error/ApiError.js';
import validator from '../utils/validator.js';
import generateJwt from '../utils/generateJwt.js';
import UserDto from '../utils/userDto.js';
import User from '../models/User.js';

class UserController {
  async registration(req, res, next) {
    try {
      const { email, password } = req.body;
      const ok = validator({ email, password });
      if (!ok) {
        return next(ApiError.badRequest('некорректные данные '));
      }
      const candidate = await User.findOne({ where: { email } });
      if (candidate) {
        return next(ApiError.badRequest('пользователь с таким емайл аддрессом уже существует'));
      }
      const hashPass = await bcrypt.hash(password, 5);
      const user = await User.create({ email, password: hashPass });
      const userDto = new UserDto(user);
      const { accessToken, refreshToken } = generateJwt({ ...userDto });
      await Token.create({ token: refreshToken, userId: user.id });
      res.setHeader(
        'Set-cookie',
        cookie.serialize('refreshToken', refreshToken, {
          maxAge: 30 * 24 * 60 * 60 * 1000,
          httpOnly: true,
        })
      );
      return res.json({ user: userDto, accessToken });
    } catch (e) {
      next(e);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const ok = validator({ email, password });
      if (!ok) {
        return next(ApiError.badRequest('некорректные данные'));
      }
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return next(ApiError.badRequest('пользователь с таким емайл аддрессом не найден'));
      }
      const checkPass = await bcrypt.compare(password, user.password);
      if (!checkPass) {
        return next(ApiError.badRequest('неверный пароль'));
      }
      const userDto = new UserDto(user);
      const { accessToken, refreshToken } = generateJwt({ ...userDto });
      const tokenExist = await Token.findOne({ where: { userId: userDto.id } });
      if (tokenExist) {
        await Token.update({ token: refreshToken }, { where: { userId: userDto.id } });
      } else {
        await Token.create({ token: refreshToken, userId: user.id });
      }

      res.setHeader(
        'Set-cookie',
        cookie.serialize('refreshToken', refreshToken, {
          maxAge: 30 * 24 * 60 * 60 * 1000,
          httpOnly: true,
        })
      );
      return res.json({ user: userDto, accessToken });
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = cookie.parse(req.headers.cookie || '');
      if (refreshToken) {
        const token = await Token.destroy({ where: { token: refreshToken } });
        res.setHeader(
          'Set-cookie',
          cookie.serialize('refreshToken', refreshToken, { maxAge: 0, httpOnly: true })
        );
        return res.json(token);
      }
      res.json('token does not exist');
    } catch (e) {
      next(e);
    }
  }

  async refreshTokens(req, res, next) {
    try {
      const { refreshToken } = cookie.parse(req.headers.cookie || '');
      if (!refreshToken) {
        return next(ApiError.unAuthorize());
      }

      const userData = jwt.verify(refreshToken, process.env.SECRET_KEY_REF);
      const tokenDb = await Token.findOne({ where: { token: refreshToken } });

      if (!userData || !tokenDb) {
        return next(ApiError.unAuthorize());
      }

      const user = await User.findOne({ where: { id: userData.id } });

      const userDto = new UserDto(user);
      const newTokens = generateJwt({ ...userDto });

      await Token.update({ token: refreshToken }, { where: { userId: user.id } });
      res.setHeader(
        'Set-cookie',
        cookie.serialize('refreshToken', refreshToken, {
          maxAge: 30 * 24 * 60 * 60 * 1000,
          httpOnly: true,
        })
      );

      return res.json({ user: userDto, accessToken: newTokens.accessToken });
    } catch (e) {
      next(e);
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await User.findAll({ attributes: ['id', 'email', 'role'] });
      return res.json(users);
    } catch (e) {
      next(e);
    }
  }

  async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await User.findOne({ where: { id } });
      const userDto = new UserDto(user);
      return res.json(userDto);
    } catch (e) {
      next(e);
    }
  }

  async removeUser(req, res, next) {
    try {
      const { id } = req.params;
      const user = await User.destroy({ where: { id } });
      const userDto = new UserDto(user);
      return res.json(userDto);
    } catch (e) {
      next(e);
    }
  }

  async updateUser(req, res, next) {
    try {
      const { email, password, newPassword } = req.body;
      const ok = validator({ email, password, newPassword });
      if (!ok) {
        return next(ApiError.badRequest('некорректные данные'));
      }
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return next(ApiError.badRequest('пользователь с таким емайл аддрессом не найден'));
      }
      const checkPass = await bcrypt.compare(password, user.password);
      if (!checkPass) {
        return next(ApiError.badRequest('неверный пароль'));
      }

      const newPasswordHahs = await bcrypt.hash(newPassword, 5);
      await User.update(
        { password: newPasswordHahs },
        {
          where: { email },
        }
      );
      return res.json('пароль изменен');
    } catch (e) {
      next(e);
    }
  }
}

export default new UserController();
