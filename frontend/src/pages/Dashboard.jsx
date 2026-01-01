import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import ThemeToggle from "../components/ThemeToggle";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Filter + move completed tasks to bottom
  const filteredTasks = tasks
    .filter((task) => task.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.completed - b.completed);

  const fetchTasks = async () => {
    const res = await API.get("/tasks");
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    await API.post("/tasks", { title });
    setTitle("");
    fetchTasks();
  };

  const toggleTask = async (id, completed) => {
    await API.put(`/tasks/${id}`, { completed: !completed });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await API.delete(`/tasks/${id}`);
    fetchTasks();
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 transition-colors px-4">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-3xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            My Tasks
          </h1>
          <button
            onClick={logout}
            className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* Add Task */}
        <form onSubmit={addTask} className="flex gap-3 mb-6">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button className="px-6 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
            Add
          </button>
        </form>

        {/* Search */}
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full mb-6 px-4 py-3 rounded-xl
            bg-slate-200 dark:bg-slate-700
            text-gray-800 dark:text-white
            placeholder-gray-500 dark:placeholder-gray-300
            border border-slate-300 dark:border-slate-600
            focus:outline-none focus:ring-2 focus:ring-blue-500
          "
        />

        {/* Tasks List (Fixed height + scroll) */}
        {tasks.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No tasks yet. Add one 🚀
          </p>
        ) : (
          <div className="max-h-[420px] overflow-y-auto no-scrollbar pr-2">
            <ul className="space-y-4">
              {filteredTasks.map((task) => (
                <li
                  key={task._id}
                  className="flex items-center justify-between p-4 rounded-xl
                  bg-slate-100 dark:bg-slate-700
                  border border-slate-200 dark:border-slate-600
                  transition hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task._id, task.completed)}
                      className="w-5 h-5 accent-blue-500 cursor-pointer"
                    />
                    <span
                      className={`text-lg ${
                        task.completed
                          ? "line-through text-gray-400"
                          : "text-gray-800 dark:text-white"
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>

                  <button
                    onClick={() => deleteTask(task._id)}
                    className="text-red-500 hover:text-red-700 text-xl"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
