import { Request, Response } from "express";
import Todo from "../models/todo.model";
import { promisify } from "util"

export const createTodo = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;

    // Create and save the todo
    const todo = new Todo({ title, description });
    await todo.save();

    res.json({ message: "Todo created successfully", todo });
  } catch (error) {
    res.status(500).json({ message: "Error creating todo" });
  }
};

// export const getTodos = async (req: Request, res: Response) => {
//   try {
//     // Get pagination parameters from query parameters
//     const { page = 1, limit = 10 } = req.query;
//     const skip = (Number(page) - 1) * Number(limit);

//     // Get todos with pagination and sorting (optional)
//     const todos = await Todo.find()
//       .skip(skip)
//       .limit(Number(limit))
//       .sort({ createdAt: -1 });

//     res.json({ todos });
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching todos" });
//   }
// };

export const getTodos = async (req: Request, res: Response) => {
    try {
      const redisClient = req.app.locals.redisClient;
      const getAsync = promisify(redisClient.get).bind(redisClient);
      const todoCacheKey = "todos";
  
      // Check if the data is available in the Redis cache
      const cachedData = await getAsync(todoCacheKey);
  
      if (cachedData) {
        console.log("Data fetched from cache.");
        return res.json({ todos: JSON.parse(cachedData) });
      }
  
      // If data is not in cache, fetch data from the database
      const todos = await Todo.find();
  
      // Store the data in the Redis cache for future use
      await redisClient.setex(todoCacheKey, 3600, JSON.stringify(todos));
  
      res.json({ todos });
    } catch (error) {
      res.status(500).json({ message: "Error fetching todos" });
    }
  };

export const updateTodo = async (req: Request, res: Response) => {
  try {
    const { title, description, completed } = req.body;
    const todoId = req.params.id;

    // Find the todo by ID
    const todo = await Todo.findById(todoId);

    // If todo not found, return an error
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    // Update the todo
    todo.title = title || todo.title;
    todo.description = description || todo.description;
    todo.completed = completed ?? todo.completed;
    await todo.save();

    res.json({ message: "Todo updated successfully", todo });
  } catch (error) {
    res.status(500).json({ message: "Error updating todo" });
  }
};

export const deleteTodo = async (req: Request, res: Response) => {
    try {
      const todoId = req.params.id;
  
      // Find the todo by ID
      const todo = await Todo.findById(todoId);
  
      // If todo not found, return an error
      if (!todo) {
        return res.status(404).json({ message: "Todo not found" });
      }
  
      // Delete the todo
      await todo.deleteOne(); // Use deleteOne() instead of remove()
  
      res.json({ message: "Todo deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting todo" });
    }
  };