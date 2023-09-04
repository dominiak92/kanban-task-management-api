const express = require("express");
const router = express.Router();
const {
  getBoards,
  getBoardById,
  createBoard,
  deleteBoard,
  updateBoardNameAndColumns,
  addTaskToColumn,
  deleteTask,
  editTask,
  editSubtask,
} = require("../controllers/boardsController");

const { protect } = require("../middleware/authMiddleware");

router.route("/").get(protect, getBoards).post(protect, createBoard);
router
  .route("/:id")
  .get(protect, getBoardById)
  .delete(protect, deleteBoard)
  .put(protect, updateBoardNameAndColumns);
router
  .route("/:boardId/columns/:columnId/tasks")
  .post(protect, addTaskToColumn);

router
  .route("/:boardId/columns/:columnId/tasks/:taskId")
  .put(protect, editTask)
  .delete(protect, deleteTask);

router
  .route("/:boardId/columns/:columnId/tasks/:taskId/subtask")
  .put(protect, editSubtask);

module.exports = router;
