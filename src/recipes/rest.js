import { Router } from 'express';
import { from } from 'rxjs';
import request from 'request-promise';

import axios from 'axios';
import { Recipe } from '../core/document';
import { RECIPE } from '~/env';

const router = Router();

router.get('/:query', async (req, res) => {
  try {
    const response = await axios.get(
      `${RECIPE.URL}&query=${req.params.query}`,
    );
    res.status(response.status).json(response.data.results);
  } catch (error) {
    res.status(500).json(error);
  }
});

/**
 * @name item - get a item
 * @param {string} id - get a item by ID
 * @return {Object<{ data: Recipe[], message: string }>}
 *
 * @example GET /crud-operations/${id}
 */
router.get('/item/:id', (req, res) => {
  from(Recipe.find({ _id: req.params.id }).exec()).subscribe(data =>
    res.json({ data, message: 'Data obtained.' }),
  );
});

/**
 * @name count - get a list length
 * @return {Object<{ data: number, message: string }>}
 *
 * @example GET /crud-operations/count
 */
router.get('/count', (req, res) => {
  from(Recipe.count().exec()).subscribe(data =>
    res.json({ data, message: 'Data obtained.' }),
  );
});

/**
 * @name pagination - get a list of paging
 * @param {number} [page=1] - current page number
 * @param {number} [row=5] - rows per page
 * @return {Object<{ data: Recipe[], message: string }>}
 *
 * @example GET /crud-operations/pagination?page=${page}&row=${row}
 */
router.get('/pagination', async (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;

  const data = [];

  const page = Number(req.query.page) || 1;
  const row = Number(req.query.row) || 5;
  const count = await request(`${baseUrl}/count`);
  const total = JSON.parse(count).data;

  for (let i = 0, l = total; i < l / row; i++) {
    if (page === i + 1) {
      data.push(
        Recipe.find({})
          .skip(i * row)
          .limit(row),
      );
    }
  }

  res.json({
    data: [...(await Promise.all(data))],
    total,
    message: 'Data obtained.',
  });
});

/**
 * @name create - create a item
 * @return {Object<{ message: string }>}
 *
 * @example POST /crud-operations { text: ${text} }
 */
router.post('/', async (req, res) => {
  if (!req.body.text) {
    res.status(400).json({ message: 'Please pass text.' });
  }

  const list = await new Recipe(req.body);
  const message = await list.save().then(() => 'Recipe saved');

  res.json({ message });
});

/**
 * @name update - update a item
 * @return {Object<{ message: string }>}
 *
 * @example PUT /crud-operations/${id}
 */
router.put('/:id', async (req, res) => {
  const message = await Recipe.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
  ).then(() => 'Recipe updated');

  res.json({ message });
});

/**
 * @name delete - remove a item
 * @return {Object<{ message: string }>}
 *
 * @example DELETE /crud-operations/${id}
 */
router.delete('/:id', async (req, res) => {
  const message = await Recipe.findByIdAndRemove(req.params.id).then(
    () => 'Recipe deleted',
  );

  res.json({ message });
});

/**
 * @name delete-multiple - remove selected items
 * @return {Object<{ message: string }>}
 *
 * @example DELETE /crud-operations { selected: [${id}, ${id}, ${id}...] }
 */
router.delete('/', async (req, res) => {
  const { selected } = req.body;

  const message = await Recipe.remove({ _id: { $in: selected } }).then(
    () => 'Recipe deleted',
  );

  res.json({ message });
});

export default router;
