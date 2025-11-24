import { predefinedQuestions } from "./questions.js";

const FEATURED_QUESTION_COUNT = 3;

const navLinks = document.querySelectorAll(".side-nav .nav-link");
const floatingSearchEl = document.getElementById("floatingSearch");
const floatingSearch = document.querySelector(".floating-search");
const floatingShell = document.querySelector(".floating-shell");
const floatingTrending = document.querySelector(".floating-trending");
const floatingTrendingList = document.getElementById("floatingTrending");
const floatingResults = document.getElementById("floatingResults");
const floatingInput = document.getElementById("floatingQuery");
const floatingSend = document.querySelector(".floating-send");
const floatingExpand = document.querySelector(".floating-expand");
const floatingOverlay = document.querySelector(".floating-overlay");
const answerContent = document.getElementById("answerContent");
const paneQuestion = document.getElementById("paneQuestion");
const paneBody = document.getElementById("paneBody");
const paneSourcesList = document.getElementById("paneSources");
const answerPaneBody = document.querySelector(".answer-pane-body");
const answerClose = document.querySelector(".answer-close");
const answerFollowupInput = document.getElementById("answerFollowupInput");
const answerSend = document.querySelector(".answer-send");
const questionBank = predefinedQuestions.map((item) => item.text);
const featuredQuestions = predefinedQuestions.slice(0, FEATURED_QUESTION_COUNT);
const aiResponses = {
  "what does jeremy like to do?": {
    answer:
      "Jeremy invests downtime into tinkering with telemetry dashboards, crafting liquid-glass inspired UIs, and guiding engineering pods through idea-to-ship rituals. He recharges by studying premium design systems and remixing them into calmer pro tooling.",
    sources: [
      { label: "Portfolio overview", url: "#" },
      { label: "IBKR Desktop roadmap", url: "#" },
    ],
  },
};
const yearEl = document.getElementById("year");

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Theme toggle functionality
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const heroVideo = document.getElementById("heroVideo");
const html = document.documentElement;

// Get saved theme or default to light
const savedTheme = localStorage.getItem("theme") || "light";
html.setAttribute("data-theme", savedTheme);
updateThemeIcon(savedTheme);
updateVideoSource(savedTheme);

// Toggle theme
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme = html.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateThemeIcon(newTheme);
    updateVideoSource(newTheme);
  });
}

function updateThemeIcon(theme) {
  if (themeIcon) {
    if (theme === "light") {
      themeIcon.className = "ph ph-moon";
    } else {
      themeIcon.className = "ph ph-sun";
    }
  }
}

function updateVideoSource(theme) {
  if (heroVideo) {
    const source = heroVideo.querySelector("source");
    if (source) {
      if (theme === "light") {
        source.src = "Untitled design.mp4";
      } else {
        source.src = "backgroundmatch.mp4";
      }
      heroVideo.load(); // Reload the video with the new source
    }
  }
}

const sections = Array.prototype.slice.call(
  document.querySelectorAll("main section, main header, footer")
);

if ("IntersectionObserver" in window) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach((section) => {
    if (section.id) {
      navObserver.observe(section);
    }
  });

  // Scroll-triggered animations for cards and sections
  const animationObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add("is-visible");
          }, index * 100);
          animationObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
  );

  // Observe all cards and hero section
  const cards = document.querySelectorAll(".card, .hero");
  cards.forEach((card) => {
    animationObserver.observe(card);
  });
} else {
  // Fallback so the nav state at least reflects the top section.
  navLinks.forEach((link, index) => {
    link.classList.toggle("is-active", index === 0);
  });
  // Show all cards immediately if no IntersectionObserver
  document.querySelectorAll(".card, .hero").forEach((card) => {
    card.classList.add("is-visible");
  });
}

const focusInput = () => {
  if (!floatingInput) return;
  try {
    floatingInput.focus({ preventScroll: true });
  } catch (error) {
    floatingInput.focus();
  }
};

const setTrendingVisibility = (shouldShow) => {
  if (!floatingTrending) return;
  floatingTrending.classList.toggle("is-hidden", !shouldShow);
};

const setResultsVisibility = (shouldShow) => {
  if (!floatingResults) return;
  floatingResults.classList.toggle("is-visible", shouldShow);
};

const setAnswerVisibility = (shouldShow) => {
  if (!floatingSearchEl) return;
  if (shouldShow) {
    // First remove is-expanded, then add has-answer to ensure proper morphing
    floatingSearchEl.classList.remove("is-expanded");
    // Small delay to let the expanded state clear before morphing
    setTimeout(() => {
      floatingSearchEl.classList.add("has-answer");
      document.body.style.overflow = "hidden";
    }, 50);
  } else {
    floatingSearchEl.classList.remove("has-answer");
    document.body.style.overflow = "";
  }
};

const toggleFloatingSearch = (forceExpand) => {
  if (!floatingSearch) return;
  const shouldExpand =
    typeof forceExpand === "boolean"
      ? forceExpand
      : !floatingSearch.classList.contains("is-expanded");
  floatingSearch.classList.toggle("is-expanded", shouldExpand);
  if (floatingShell) {
    floatingShell.setAttribute("aria-expanded", String(shouldExpand));
  }
  if (shouldExpand) {
    focusInput();
  }
};

if (floatingShell) {
  floatingShell.setAttribute("aria-expanded", "false");
  floatingShell.addEventListener("click", function () {
    toggleFloatingSearch();
  });
  floatingShell.addEventListener("keypress", function (event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleFloatingSearch();
    }
  });
}

if (floatingSearch) {
  floatingSearch.addEventListener("click", function (event) {
    if (floatingSearch.classList.contains("is-expanded")) {
      return;
    }
    event.stopPropagation();
    toggleFloatingSearch(true);
  });
}

if (floatingExpand) {
  floatingExpand.addEventListener("click", function (event) {
  event.stopPropagation();
  toggleFloatingSearch();
});
}

document.addEventListener("click", function (event) {
  if (!floatingSearch || floatingSearch.contains(event.target)) {
    return;
  }
  toggleFloatingSearch(false);
  setAnswerVisibility(false);
});

if (floatingOverlay) {
  floatingOverlay.addEventListener("click", function () {
    toggleFloatingSearch(false);
  });
}

if (floatingInput) {
  floatingInput.addEventListener("focus", function () {
    toggleFloatingSearch(true);
  });
}

const createQuestionButton = (label) => {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.addEventListener("click", () => {
    toggleFloatingSearch(true);
    if (floatingInput) {
      floatingInput.value = label;
      updateFiltered(label);
      focusInput();
      handleSubmit(label);
    }
  });
  return button;
};

const renderTrending = () => {
  if (!floatingTrendingList) return;
  floatingTrendingList.innerHTML = "";
  featuredQuestions.forEach((question) => {
    const li = document.createElement("li");
    li.appendChild(createQuestionButton(question.text));
    floatingTrendingList.appendChild(li);
  });
  setTrendingVisibility(true);
  setResultsVisibility(false);
};

const updateFiltered = (query) => {
  if (!floatingResults) return;
  const trimmed = query.trim().toLowerCase();
  floatingResults.innerHTML = "";

  if (floatingSend) {
    if (trimmed.length === 0) {
      floatingSend.setAttribute("disabled", "true");
    } else {
      floatingSend.removeAttribute("disabled");
    }
  }

  const hasQuery = trimmed.length > 0;
  setTrendingVisibility(!hasQuery);
  setResultsVisibility(hasQuery);
  if (!hasQuery) {
    setAnswerVisibility(false);
  }

  if (!hasQuery) {
    return;
  }

  const matches = questionBank.filter((question) =>
    question.toLowerCase().includes(trimmed)
  );

  if (matches.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "No matching questions yet. Try another phrase.";
    floatingResults.appendChild(empty);
    return;
  }

  matches.forEach((match) => {
    const button = createQuestionButton(match);
    floatingResults.appendChild(button);
  });
};

if (floatingInput) {
  floatingInput.addEventListener("input", (event) => {
  const value = event.currentTarget.value;
  updateFiltered(value);
  });

  floatingInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit(event.currentTarget.value);
    }
  });
}

const typeAnswer = (text, callback) => {
  if (!paneBody) return;
  answerPaneBody?.classList.remove("is-complete");
  paneBody.textContent = "";
  let index = 0;
  const interval = setInterval(() => {
    paneBody.textContent += text.charAt(index);
    index += 1;
    if (index >= text.length) {
      clearInterval(interval);
      answerPaneBody?.classList.add("is-complete");
      callback?.();
    }
  }, 18);
};

const renderAnswer = (question, response) => {
  if (!floatingSearchEl || !paneQuestion || !paneBody || !paneSourcesList) return;
  paneQuestion.textContent = question;
  const answerText =
    response?.answer ??
    "This page is under construction";
  
  // Hide overlay when showing answer
  if (floatingOverlay) {
    floatingOverlay.classList.remove("is-active");
  }
  
  // Show answer first, then start typing animation
  setAnswerVisibility(true);
  
  // Small delay to let the morph animation start
  setTimeout(() => {
    typeAnswer(answerText);
  }, 400);

  paneSourcesList.innerHTML = "";
  const sources = response?.sources?.length
    ? response.sources
    : [{ label: "Internal insights notebook", url: "#" }];
  sources.forEach((source) => {
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = source.url ?? "#";
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = source.label;
    li.appendChild(link);
    paneSourcesList.appendChild(li);
  });
};

const handleSubmit = (value) => {
  const trimmed = value.trim();
  if (!trimmed) {
    setAnswerVisibility(false);
    return;
  }
  // First close the search panel completely
  if (floatingSearchEl) {
    floatingSearchEl.classList.remove("is-expanded");
    // Hide overlay
    if (floatingOverlay) {
      floatingOverlay.classList.remove("is-active");
    }
  }
  toggleFloatingSearch(false);
  
  // Small delay to ensure search closes before morphing
  setTimeout(() => {
    const key = trimmed.toLowerCase();
    const response = aiResponses[key];
    renderAnswer(trimmed, response);
  }, 100);
};

floatingSend?.addEventListener("click", (event) => {
  event.preventDefault();
  handleSubmit(floatingInput?.value ?? "");
});

answerClose?.addEventListener("click", () => {
  setAnswerVisibility(false);
  toggleFloatingSearch(false);
  if (paneBody) paneBody.textContent = "";
  answerPaneBody?.classList.remove("is-complete");
  if (floatingInput) floatingInput.value = "";
  if (answerFollowupInput) answerFollowupInput.value = "";
});

// Handle follow-up question in answer pane
if (answerFollowupInput) {
  answerFollowupInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit(event.currentTarget.value);
      event.currentTarget.value = "";
    }
  });
}

if (answerSend) {
  answerSend.addEventListener("click", (event) => {
    event.preventDefault();
    if (answerFollowupInput) {
      handleSubmit(answerFollowupInput.value);
      answerFollowupInput.value = "";
    }
  });
}

renderTrending();
