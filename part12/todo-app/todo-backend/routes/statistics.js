const express = require('express');
const { getAsync } = require('../redis')
const router = express.Router();

/* GET statistics. */
router.get('/', async (_, res) => {
  const addedTodos = await getAsync('added_todos') || 0
  res.send({
    added_todos: parseInt(addedTodos)
  });
});

module.exports = router; 