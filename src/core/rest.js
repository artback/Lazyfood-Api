import { Router } from 'express';

import recipes from '~/recipes/rest';
import authorization from '~/authorization/rest';

const router = Router();

router.get('/', (req, res) => {
  res.send('app-root');
});

router.use('/recipes', recipes);
router.use('/authorization', authorization);

export default router;
