import { Router } from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { SECRET, AUTH } from '~/env';

import { User } from './document';

const router = Router();

router.get('/facebook', passport.authenticate('facebook'));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
router.get('/facebook/callback', (req, res, next) => {
  passport.authenticate(
    'facebook',
    {
      successRedirect: 'https://localhost:4200/',
      failureRedirect: 'https://localhost:4200/notlogin',
      session: false,
    },
    (err, user, jwtToken) => {
      if (!user) {
        return res.redirect(`https://localhost:4200/home`);
      }
      return res.redirect(
        `https://localhost:4200/home?id=${user._id.toString()}&name=${
          user.displayName
        }&=token=${jwtToken}`,
      );
    },
  )(req, res, next);
});
/**
 * @name register - Register an account
 * @return {Object<{ username: string, message: string }>}
 *
 * @example POST /authorization/register { username: ${username}, password: ${password} }
 */
router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ username, password: passwordHash, email });
    await user.save();
  } catch (error) {
    return res.ok().json({ error });
  }
  return res.ok();
});

/**
 * @name login - get user token
 * @return {Object<{ username: string, token: string, message: string }>}
 *
 * @example POST /authorization/login { username: ${username}, password: ${password} }
 */
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username }).exec();
    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (passwordsMatch) {
      const payload = {
        username: user.username,
        expires: Date.now() + 3 * 60 * 60 * 1000,
      };

      req.login(payload, { session: false }, error => {
        if (error) res.status(400).json({ message: error });

        const token = jwt.sign(JSON.stringify(payload), SECRET);

        res.status(200).json({
          username: user.username,
          token,
          message: 'Sign in suceesfully',
        });
      });
    } else {
      res.status(400).json({ message: 'Incorrect Username / Password' });
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

/**
 * @name profile - User profile
 *
 * @example GET /authorization/profile Header { Authorization: `Bearer ${token}` }
 */
router.get(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { user } = req;

    return res.status(200).json({ user });
  },
);

/**
 * @name profile - Update user profile
 */
router.put('/profile', (req, res) => {
  res.json({});
});

router.post('/forgot-password', (req, res) => {
  res.json({});
});

router.post('/change-email', (req, res) => {
  res.json({});
});

router.post('/change-password', (req, res) => {
  res.json({});
});

export default router;
