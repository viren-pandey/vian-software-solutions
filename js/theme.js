(function () {
  const root = document.documentElement;
  const stored = localStorage.getItem("vian-theme");
  const preferredDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.dataset.theme = stored || (preferredDark ? "dark" : "light");

  function updateButton() {
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.setAttribute("aria-label", root.dataset.theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
      button.textContent = root.dataset.theme === "dark" ? "☀" : "◐";
    });
  }

  window.addEventListener("DOMContentLoaded", updateButton);

  document.addEventListener("click", (event) => {
    const toggle = event.target.closest("[data-theme-toggle]");
    if (!toggle) return;
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("vian-theme", root.dataset.theme);
    updateButton();
  });
})();
