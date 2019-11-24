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
            'http%3A%2F%2Fwww.edamam.com%2Fontologies%2Fedamam.owl%23recipe_1b6dfeaf0988f96b187c7c9bb69a14fa',
          updated: '2019-09-04T17:25:34.687Z'
        },
        {
          value: 5,
          user_id: '375012663285633',
          recipe_id:
            'http%3A%2F%2Fwww.edamam.com%2Fontologies%2Fedamam.owl%23recipe_a7d58871fda455844753aace394440ae',
          updated: '2019-09-04T17:25:34.687Z'
        },
        {
          value: 4,
          user_id: '375012663285633',
          recipe_id:
            'http%3A%2F%2Fwww.edamam.com%2Fontologies%2Fedamam.owl%23recipe_b2ebad01df2a319d259c2d3f61eb40c5',
          updated: '2019-09-04T17:25:34.687Z'
        },
        {
          value: 3,
          user_id: '375012663285633',
          recipe_id:
            'http%3A%2F%2Fwww.edamam.com%2Fontologies%2Fedamam.owl%23recipe_d7167bbdf03eb4b786684ab6a81d52b4',
          updated: '2019-09-04T17:25:34.687Z'
        },
        {
          value: 3,
          user_id: '375012663285633',
          recipe_id:
            'http%3A%2F%2Fwww.edamam.com%2Fontologies%2Fedamam.owl%23recipe_f120986ea8ca0b283984f7d7586028c6',
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
