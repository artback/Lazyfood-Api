import { Router } from 'express';

import crudOperations from '~/crud-operations/rest';
import authorization from '~/authorization/rest';

const router = Router();

router.get('/', (req, res) => {
  res.send('app-root');
});

router.use('/crud-operations', crudOperations);
router.use('/authorization', authorization);

export default router;
