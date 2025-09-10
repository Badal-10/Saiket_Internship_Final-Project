import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [editText, setEditText] = useState("");

  // Format date for task creation
  const formatDateTime = (timestamp) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(timestamp).toLocaleString("en-IN", options);
  };

  // Current day & date for header
  const currentDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Add Task (newest first)
  const addTask = () => {
    if (task.trim() === "") {
      toast.warn("⚠️ Please enter a task first.");
      return;
    }
    setTasks([
      { id: Date.now(), text: task, createdAt: Date.now() },
      ...tasks,
    ]);
    toast.success("📝 Task added successfully!");
    setTask("");
  };

  // Delete Task
  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
    toast.error("🗑️ Task deleted.");
  };

  // Start Editing
  const startEdit = (task) => {
    setEditingTask(task.id);
    setEditText(task.text);
  };

  // Save Edited Task
  const saveEdit = (id) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, text: editText } : t
      )
    );
    setEditingTask(null);
    setEditText("");
    toast.info("✏️ Task updated.");
  };

  // Clear All Tasks
  const clearAllTasks = () => {
    setTasks([]);
    toast.warn("🧹 All tasks cleared!");
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
      
      {/* Header */}
      <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 p-6 text-center shadow-lg sticky top-0 z-10">
        <h1 className="text-3xl font-extrabold text-white drop-shadow-lg">
          📝 To-Do List
        </h1>
        <p className="text-gray-200 mt-1">{currentDate}</p>
        <p className="text-gray-100 mt-1 text-sm">Total Tasks: {tasks.length}</p>

        {/* Input + Buttons */}
        <div className="flex flex-col sm:flex-row mt-4 max-w-md mx-auto gap-2">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="flex-1 p-3 rounded-xl outline-none bg-white/20 text-white placeholder-gray-200 border border-white/30"
            placeholder="Enter task..."
          />
          <div className="flex gap-2">
            <button
              onClick={addTask}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 text-white px-5 rounded-xl transition-all duration-300"
            >
              Add
            </button>
            <button
              onClick={clearAllTasks}
              className="bg-red-500 hover:bg-red-600 text-white px-5 rounded-xl transition-all duration-300"
            >
              Clear All
            </button>
          </div>
        </div>
      </header>

      {/* Scrollable Tasks Section */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {tasks.map((t) => (
            <div
              key={t.id}
              className="flex flex-col bg-white/20 p-4 rounded-xl border border-white/30 backdrop-blur-lg shadow-md"
            >
              <div className="flex items-start justify-between">
                {editingTask === t.id ? (
                  <>
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="flex-1 p-2 rounded-lg mr-2 bg-white/40 text-gray-900 resize-none"
                      rows="2"
                    />
                    <button
                      onClick={() => saveEdit(t.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg transition"
                    >
                      ✅
                    </button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-white font-medium break-words whitespace-normal">
                      {t.text}
                    </span>
                    <div className="flex gap-2 ml-2">
                      <button
                        onClick={() => startEdit(t)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg transition"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => deleteTask(t.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition"
                      >
                        ❌
                      </button>
                    </div>
                  </>
                )}
              </div>
              {/* Task Creation Time */}
              <p className="text-xs text-gray-200 mt-2">
                🕒 Added on: {formatDateTime(t.createdAt)}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="backdrop-blur-xl bg-white/10 border-t border-white/20 p-4 text-center text-white text-sm sticky bottom-0">
        © {new Date().getFullYear()} | By <span className="font-bold">Badal Kumar Nayak</span>
      </footer>

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        theme="colored"
      />
    </div>
  );
}

export default App;
