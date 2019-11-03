import passport from 'passport';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import * as Facebook from 'passport-facebook';
import jwt from 'jsonwebtoken';

import { SECRET, AUTH } from '~/env';

import { User } from '~/authorization/document';

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: SECRET,
    },
    async (jwtPayload, done) => {
      try {
        if (Date.now() > jwtPayload.expires) return done('Token expired');

        const user = await User.findOne({
          id: jwtPayload.id,
        }).exec();
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

// Use facebook strategy
passport.use(
  new Facebook.Strategy(
    {
      clientID: AUTH.FACEBOOK.clientID,
      clientSecret: AUTH.FACEBOOK.clientSecret,
      callbackURL: AUTH.callbackURL,
      profileFields: ['id', 'displayName', 'photos', 'email'],
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne(
        {
          id: profile.id,
        },
        // eslint-disable-next-line consistent-return
        (err, user) => {
          if (err) {
            return done(err);
          }
          if (!user) {
            const nUser = new User({
              displayName: profile.displayName,
              email: profile.emails[0].value,
              id: profile.id,
              token: accessToken,
              provider: 'facebook',
              facebook: profile._json,
            });
            nUser.save(sErr => {
              if (sErr) console.log(sErr);
              const token = jwt.sign(user, SECRET);
              return done(err, user, token);
            });
          } else {
            const token = jwt.sign(user, SECRET);
            return done(err, user, token);
          }
        },
      );
    },
  ),
);
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

export default passport;
