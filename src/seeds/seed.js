import chalk from 'chalk';
import { Rating } from '../core/document';
import { User } from '../authorization/document';
import mongoose from '~/core/mongoose';

mongoose.connection
  .once('open', () =>
    console.log(chalk.hex('#009688')(' [*] Mongo: Connection Succeeded.')),
  )
  .then(() => {
    const seedEvents = (values, Collection) => {
      // create some events

      // use the Event model to insert/save
      values.forEach(val => {
        const newModel = new Collection(val);
        newModel.save();
      });

      // seeded!
      console.log('Database seeded!');
    };
    seedEvents(
      [
        {
          value: 5,
          user_id: '375012663285633',
          recipe_id:
            '246916',
          updated: '2019-09-04T17:25:34.687Z'
        },
        {
          value: 5,
          user_id: '375012663285633',
          recipe_id:
            '245166',
          updated: '2019-09-04T17:25:34.687Z'
        },
        {
          value: 4,
          user_id: '375012663285633',
          recipe_id:
            '246009',
          updated: '2019-09-04T17:25:34.687Z'
        },
        {
          value: 3,
          user_id: '375012663285633',
          recipe_id:
            '219957',
          updated: '2019-09-04T17:25:34.687Z'
        },
        {
          value: 3,
          user_id: '375012663285633',
          recipe_id:
            '607109',
          updated: '2019-09-04T17:25:34.687Z'
        },
      ],
      Rating,
    );
    seedEvents(
      [
        {
          id: '375012663285633',
          password: '123456',
          email: 'artbacK@email.com',
          role: 'admin',
          permissions: [],
        },
      ],
      User,
    );
  });
