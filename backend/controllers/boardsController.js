const asyncHandler = require("express-async-handler");
const Board = require("../models/boardModel");
const User = require("../models/userModel");

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

// @desc Get a single board for a user by ID
// @route GET /api/boards/:id
// @access Private (but accessible by all logged-in users)

const getBoardById = asyncHandler(async (req, res) => {
  // Check if user is logged in
  if (!req.user || !req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

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

const updateBoardName = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  const board = await Board.findById(req.params.id);

  if (!board) {
    res.status(404);
    throw new Error("Board not found");
  }

  if (req.body.name) {
    board.name = req.body.name;
  }

  const updatedBoard = await board.save();
  res.status(200).json(updatedBoard);
});

// @desc Delete a board
// @route DELETE /api/boards/:id
// @access Private (but accessible by all logged-in users)

const deleteBoard = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  const board = await Board.findById(req.params.id);

  if (!board) {
    res.status(404);
    throw new Error("Board not found");
  }

  await board.deleteOne();

  res.status(200).json({ id: req.params.id });
});
