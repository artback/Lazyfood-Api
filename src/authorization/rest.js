import { Router } from 'express';
import passport from 'passport';

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
      console.log('token ', jwtToken);
      return res.redirect(
        `https://localhost:4200/home?id=${user._id.toString()}&name=${
          user.displayName
        }&token=${encodeURI(jwtToken)}`,
      );
    },
  )(req, res, next);
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
