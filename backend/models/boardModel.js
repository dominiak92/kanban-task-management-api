const mongoose = require("mongoose");

const subtaskSchema = new mongoose.Schema({
  title: {
    type: String,
    default: '',
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
});

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    default: '',
    enum: ["To do", "Doing", "Done"],
  },
  subtasks: {
    type: [subtaskSchema],
    default: [],
  },
});

const ColumnSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  tasks: {
    type: [TaskSchema],
    default: [],
  },
});

const BoardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  columns: {
    type: [ColumnSchema],
    default: [],
  },
});

module.exports = mongoose.model("Board", BoardSchema);
