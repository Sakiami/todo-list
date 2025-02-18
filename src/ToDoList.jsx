import React, { useState, useEffect } from 'react';
import './index.css'; // Create this CSS file

function ToDoList() {
  // Changed initial tasks to objects with "text" and "completed" properties
  // Load tasks from localStorage on initial render
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);
  
  // newTask now stores a string for the input field
  const [newTask, setNewTask] = useState("");
  // For editing: store the index of the task being edited and its new text
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState("");

  // Handle input change for new tasks
  function handleInputChange(event) {
    setNewTask(event.target.value);
  }

  // Create a new task
  function addTask() {
    if (newTask.trim() !== "") {
      setTasks(t => [...t, { text: newTask, completed: false }]);
      setNewTask("");
    }
  }

  // Delete a single task with confirmation
  function deleteTask(index) {
    if (window.confirm("Are you sure you want to delete this task?")) {
      const updatedTasks = tasks.filter((_, i) => i !== index);
      setTasks(updatedTasks);
    }
  }

  // Move a task up
  function moveTaskUp(index) {
    if (index > 0) {
      const updatedTasks = [...tasks];
      [updatedTasks[index], updatedTasks[index - 1]] = [updatedTasks[index - 1], updatedTasks[index]];
      setTasks(updatedTasks);
    }
  }

  // Move a task down
  function moveTaskDown(index) {
    if (index < tasks.length - 1) {
      const updatedTasks = [...tasks];
      [updatedTasks[index], updatedTasks[index + 1]] = [updatedTasks[index + 1], updatedTasks[index]];
      setTasks(updatedTasks);
    }
  }

  // Toggle the completion status of a task (adds strike-through when done)
  function toggleTaskStatus(index) {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  }

  // Start editing a task
  function startEditing(index) {
    setEditingIndex(index);
    setEditingText(tasks[index].text);
  }

  // Update the task after editing
  function updateTask(index) {
    if (editingText.trim() !== "") {
      const updatedTasks = [...tasks];
      updatedTasks[index].text = editingText;
      setTasks(updatedTasks);
      setEditingIndex(null);
      setEditingText("");
    }
  }

  // Cancel the editing mode
  function cancelEditing() {
    setEditingIndex(null);
    setEditingText("");
  }

  // Delete all tasks with confirmation
  function deleteAllTasks() {
    if (window.confirm("Are you sure you want to delete ALL tasks?")) {
      setTasks([]);
    }
  }

  // Mark all tasks as done
  function markAllDone() {
    const updatedTasks = tasks.map(task => ({ ...task, completed: true }));
    setTasks(updatedTasks);
  }
  return (
    <div className="to-do-list" style={{ background: 'linear-gradient(150deg, #F5A12C20 0%, #5E188920 100%)' }}>
      <header className="brand-header">
        <div className="logo-container">
          <img 
            src="/LexMeetLogo.png" 
            alt="LexMeet Logo" 
            className="logo-image"
          />
          <div className="logo-text-container">
            <p className="tagline">LexMeet's very own To-Do App!</p>
        </div>
      </div>
    </header>

      <main className="task-manager">
        <div className="input-section">
          <input
            type="text"
            placeholder="Enter a task..."
            value={newTask}
            onChange={handleInputChange}
            className="task-input"
          />
          <button className="add-button" onClick={addTask}>
            Add Task
          </button>
        </div>

        <div className="global-actions">
          <button className="action-btn done-all" onClick={markAllDone}>
            Complete All
          </button>
          <button className="action-btn delete-all" onClick={deleteAllTasks}>
            Clear All
          </button>
        </div>

        <ol className="task-list">
          {tasks.map((task, index) => (
            <li key={index} className="task-item">
              <div className="task-content">
                {editingIndex === index ? (
                  <div className="edit-container">
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="edit-input"
                    />
                    <div className="edit-actions">
                      <button className="confirm-edit" onClick={() => updateTask(index)}>
                        Confirm
                      </button>
                      <button className="cancel-edit" onClick={cancelEditing}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <span
                      className={`task-text ${task.completed ? 'completed' : ''}`}
                      onClick={() => toggleTaskStatus(index)}
                    >
                      {task.text}
                    </span>
                    <div className="task-controls">
                      <button className="control-btn edit" onClick={() => startEditing(index)}>
                        Edit
                      </button>
                      <button className="control-btn delete" onClick={() => deleteTask(index)}>
                        Delete
                      </button>
                      <div className="move-buttons">
                        <button className="move-btn" onClick={() => moveTaskUp(index)}>
                          ↑
                        </button>
                        <button className="move-btn" onClick={() => moveTaskDown(index)}>
                          ↓
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="divider-line"></div>
            </li>
          ))}
        </ol>
      </main>
    </div>
  );
}

export default ToDoList;