tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5",
        secondary: "#10B981",
        dark: "#1E293B",
        light: "#F8FAFC",
      },
    },
  },
};
// Mobile menu toggle
document
  .getElementById("mobile-menu-button")
  .addEventListener("click", function () {
    document.getElementById("sidebar").classList.toggle("translate-x-0");
  });

// Close sidebar when clicking outside on mobile
document.addEventListener("click", function (event) {
  const sidebar = document.getElementById("sidebar");
  const menuButton = document.getElementById("mobile-menu-button");

  if (
    window.innerWidth < 768 &&
    !sidebar.contains(event.target) &&
    event.target !== menuButton &&
    !menuButton.contains(event.target)
  ) {
    sidebar.classList.remove("translate-x-0");
  }
});

// Simple animation for progress circles
document.addEventListener("DOMContentLoaded", function () {
  const circles = document.querySelectorAll(".circle-fill");
  circles.forEach((circle) => {
    const length = circle.getTotalLength();
    circle.style.strokeDasharray = length;
    circle.style.strokeDashoffset = length;
    circle.getBoundingClientRect();
    const value = circle.getAttribute("stroke-dasharray").split(",")[0];
    circle.style.strokeDashoffset = length - (value * length) / 100;
  });
});
function toggleMenu(menuId, iconId) {
  const menu = document.getElementById(menuId);
  const icon = document.getElementById(iconId);

  if (menu.classList.contains("max-h-0")) {
    menu.classList.remove("max-h-0");
    menu.classList.add("max-h-60"); // Adjust height based on items
    icon.classList.add("rotate-180");
  } else {
    menu.classList.add("max-h-0");
    menu.classList.remove("max-h-60");
    icon.classList.remove("rotate-180");
  }
}
