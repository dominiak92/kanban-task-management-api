const mongoose = require("mongoose");

const subtaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
});

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["todo", "doing", "done", "now", "next", "later"],
  },
  subtasks: {
    type: [subtaskSchema],
    required: true,
  },
});

const ColumnSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  tasks: {
    type: [TaskSchema],
    required: true,
  },
});

const BoardSchema = new mongoose.Schema({
  name: String,
  columns: {
    type: [ColumnSchema],
    required: true,
  },
});

module.exports = mongoose.model("Board", BoardSchema);