const ThemeToggle = () => {
  const toggleTheme = () => {
    const root = document.documentElement;
    root.classList.toggle("dark");
    localStorage.theme = root.classList.contains("dark")
      ? "dark"
      : "light";
  };

  return (
    <button
      onClick={toggleTheme}
      className="px-3 py-1.5 rounded-lg text-sm bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-slate-600 transition"
      title="Toggle dark mode"
    >
      🌙
    </button>
  );
};

export default ThemeToggle;
