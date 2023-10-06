const express = require('express');
const bodyParser = require('body-parser');
const db=require('./pgconnect')
const {validateInput,bookSchemaValidation, todoSchemaValidation} = require('./utilities');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Create a new To-Do item
app.post('/todos',validateInput(todoSchemaValidation), async (req, res) => {
    try {
      const { title, description, completed } = req.body;
      const query = 'INSERT INTO todoitem (title, description, completed) VALUES ($1, $2, $3) RETURNING *';
      const newTodo = await db.one(query, [title, description, completed]);
      res.json(newTodo);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Unable to create a new To-Do item' });
    }
  });
  
  // Get all To-Do items
  app.get('/todos', async (req, res) => {
    try {
      const todos = await db.any('SELECT * FROM todoitem');
      res.json(todos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Unable to fetch To-Do items' });
    }
  });
  
  // Get a single To-Do item by its ID
  app.get('/todos/:id', async (req, res) => {
    try {
      const todoId = req.params.id;
      const todo = await db.oneOrNone('SELECT * FROM todoitem WHERE id = $1', todoId);
      if (!todo) {
        res.status(404).json({ error: 'To-Do item not found' });
      } else {
        res.json(todo);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Unable to fetch To-Do item' });
    }
  });
  
  // Update a To-Do item
  app.put('/todos/:id',validateInput(todoSchemaValidation), async (req, res) => {
    try {
      const todoId = req.params.id;
      const { title, description, completed } = req.body;
      const query = 'UPDATE todoitem SET title = $1, description = $2, completed = $3 WHERE id = $4 RETURNING *';
      const updatedTodo = await db.oneOrNone(query, [title, description, completed, todoId]);
      if (!updatedTodo) {
        res.status(404).json({ error: 'To-Do item not found' });
      } else {
        res.json(updatedTodo);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Unable to update To-Do item' });
    }
  });
  
  // Delete a To-Do item
  app.delete('/todos/:id', async (req, res) => {
    try {
      const todoId = req.params.id;
      const deletedTodo = await db.oneOrNone('DELETE FROM todoitem WHERE id = $1 RETURNING *', todoId);
      if (!deletedTodo) {
        res.status(404).json({ error: 'To-Do item not found' });
      } else {
        res.json({ message: 'To-Do item deleted' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Unable to delete To-Do item' });
    }
  });
  

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
