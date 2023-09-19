const asyncHandler = require("express-async-handler");
const Board = require("../models/boardModel");

// @desc Get all boards
// @route GET /api/boards
// @access Private (but accessible by all logged-in users)

const getBoards = asyncHandler(async (req, res) => {
  const boards = await Board.find();
  res.status(200).json(boards);
});

// @desc Create a new board
// @route POST /api/boards
// @access Private (but accessible by all logged-in users)

const createBoard = asyncHandler(async (req, res) => {
  const board = new Board({
    ...req.body,
    user: req.user.id,
  });

  const createdBoard = await board.save();
  res.status(201).json(createdBoard);
});

// @desc Get a single board by ID
// @route GET /api/boards/:id
// @access Private (but accessible by all logged-in users)

const getBoardById = asyncHandler(async (req, res) => {
  const board = await Board.findById(req.params.id);
  if (!board) {
    res.status(404);
    throw new Error("Board not found");
  }

  res.status(200).json(board);
});

// @desc Update board name
// @route PUT /api/boards/:id
// @access Private (but accessible by all logged-in users)

// const updateBoardNameAndColumns = asyncHandler(async (req, res) => {
//   const board = await Board.findById(req.params.id);

//   if (!board) {
//     res.status(404);
//     throw new Error("Board not found");
//   }

//   //Edit Board Name

//   if (req.body.name) {
//     board.name = req.body.name;
//   }

//   // Add new columns

//   if (req.body.newColumns) {
//     board.columns.push(...req.body.newColumns);
//   }

//   if (req.body.columnsToRemove) {
//     board.columns = board.columns.filter(
//       (column) => !req.body.columnsToRemove.includes(column._id)
//     );
//   }

//   const updatedBoard = await board.save();

//   res.status(200).json("Board is updated " + updatedBoard);
// });

const updateBoardNameAndColumns = asyncHandler(async (req, res) => {
  const board = await Board.findById(req.params.id);

  if (!board) {
    res.status(404);
    throw new Error("Board not found");
  }

  // Edytuj nazwę tablicy
  if (req.body.name) {
    board.name = req.body.name;
  }

  // Zamień kolumny
  if (req.body.columns) {
    board.columns = req.body.columns;
  }

  const updatedBoard = await board.save();

  res.status(200).json("Board is updated " + updatedBoard);
});

// @desc Delete a board
// @route DELETE /api/boards/:id
// @access Private (but accessible by all logged-in users)

const deleteBoard = asyncHandler(async (req, res) => {
  const board = await Board.findById(req.params.id);

  if (!board) {
    res.status(404);
    throw new Error("Board not found");
  }

  await board.deleteOne();

  res.status(200).json({ message: `Board of id: ${req.params.id} deleted` });
});

// @desc Add a new task to a specific column in a specific board
// @route POST /boards/:boardId/columns/:columnId/tasks
// @access Private (but accessible by all logged-in users)

const addTaskToColumn = asyncHandler(async (req, res) => {
  //Find the board
  const board = await Board.findById(req.params.boardId);
  if (!board) {
    res.status(404);
    throw new Error("Board not found");
  }

  //Find the column
  const column = board.columns.id(req.params.columnId);
  if (!column) {
    res.status(404);
    throw new Error("Column not found");
  }

  //Add the new task
  const newTask = {
    title: req.body.title,
    description: req.body.description,
    status: req.body.status,
  };

  if (req.body.subtasks && Array.isArray(req.body.subtasks)) {
    newTask.subtasks = req.body.subtasks.map((subtask) => ({
      title: subtask.title,
      isCompleted: subtask.isCompleted || false,
    }));
  }

  column.tasks.push(newTask);

  await board.save();

  res.status(200).json({ message: "Task added " + newTask });
});

// @desc Edit task in a specific column in a specific board
// @route PUT /boards/:boardId/columns/:columnId/tasks/:tasksId
// @access Private (but accessible by all logged-in users)

const editTask = asyncHandler(async (req, res) => {
  //Find the board
  const board = await Board.findById(req.params.boardId);
  if (!board) {
    res.status(404);
    throw new Error("Board not found");
  }

  //Find the column
  const column = board.columns.id(req.params.columnId);
  if (!column) {
    res.status(404);
    throw new Error("Column not found");
  }

  //Find the task
  const task = column.tasks.id(req.params.taskId);
  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  // Edit task fields
  if (req.body.title) {
    task.title = req.body.title;
  }

  if (req.body.description) {
    task.description = req.body.description;
  }

  if (req.body.status) {
    task.status = req.body.status;
  }

  // Edit or add subtasks
  if (req.body.subtasks && Array.isArray(req.body.subtasks)) {
    task.subtasks = req.body.subtasks.map((subtask) => ({
      title: subtask.title,
      isCompleted: subtask.isCompleted || false,
    }));
  }

  if (req.body.subtasksToRemove && Array.isArray(req.body.subtasksToRemove)) {
    task.subtasks = task.subtasks.filter(
      (subtask) => !req.body.subtasksToRemove.includes(subtask._id.toString())
    );
  }

  await board.save();
  res.status(200).json({ message: "Task updated " + task });
});

// @desc Delete task in a specific column in a specific board
// @route DELETE /boards/:boardId/columns/:columnId/tasks/:tasksId
// @access Private (but accessible by all logged-in users)

const deleteTask = asyncHandler(async (req, res) => {
  //Find the board
  const board = await Board.findById(req.params.boardId);
  if (!board) {
    res.status(404);
    throw new Error("Board not found");
  }

  //Find the column
  const column = board.columns.id(req.params.columnId);
  if (!column) {
    res.status(404);
    throw new Error("Column not found");
  }

  //Find the task
  const task = column.tasks.id(req.params.taskId);
  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }
  task.remove();
  await board.save();
  res.status(200).json({ message: "Task deleted" });
});

// @desc Edit subtask in a specific column in a specific board
// @route PUT /boards/:boardId/columns/:columnId/tasks/:tasksId
// @access Private (but accessible by all logged-in users)

const editSubtask = asyncHandler(async (req, res) => {
  //Find the board
  const board = await Board.findById(req.params.boardId);
  if (!board) {
    res.status(404);
    throw new Error("Board not found");
  }

  //Find the column
  const column = board.columns.id(req.params.columnId);
  if (!column) {
    res.status(404);
    throw new Error("Column not found");
  }

  //Find the task
  const task = column.tasks.id(req.params.taskId);
  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  // Edit task fields
  if (req.body.status) {
    task.status = req.body.status;
  }

  // Edit or add subtasks
  if (req.body.subtasks && Array.isArray(req.body.subtasks)) {
    task.subtasks = task.subtasks.map((currentSubtask, index) => {
      const newSubtask = req.body.subtasks[index];
      return {
        ...currentSubtask,
        ...newSubtask,
      };
    });
  }

  await board.save();
  res.status(200).json({ message: "Subtask updated " + task }); // Return updated task
});

module.exports = {
  getBoards,
  getBoardById,
  createBoard,
  deleteBoard,
  updateBoardNameAndColumns,
  addTaskToColumn,
  deleteTask,
  editTask,
  editSubtask,
};
