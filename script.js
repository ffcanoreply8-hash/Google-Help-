(() => {
  "use strict";

  const helpSearch = document.getElementById("helpSearch");
  const clearSearchButton = document.getElementById(
    "clearSearch"
  );

  const topicCards = Array.from(
    document.querySelectorAll(".topic-card")
  );

  const noResults = document.getElementById("noResults");

  const topicModal = document.getElementById("topicModal");

  const topicModalTitle = document.getElementById(
    "topicModalTitle"
  );

  const topicModalDescription = document.getElementById(
    "topicModalDescription"
  );

  const simulationModal = document.getElementById(
    "simulationModal"
  );

  const simulationForm = document.getElementById(
    "simulationForm"
  );

  const openSimulationButton = document.getElementById(
    "openSimulation"
  );

  const startExerciseButton = document.getElementById(
    "startExercise"
  );

  const closeSimulationButton = document.getElementById(
    "closeSimulation"
  );

  const clueItems = Array.from(
    document.querySelectorAll(".clue-item")
  );

  const clickableClues = Array.from(
    document.querySelectorAll(".clickable-clue")
  );

  const clueScore = document.getElementById("clueScore");

  const revealCluesButton = document.getElementById(
    "revealClues"
  );

  const resetCluesButton = document.getElementById(
    "resetClues"
  );

  const resultModal = document.getElementById("resultModal");

  const finishLessonButton = document.getElementById(
    "finishLesson"
  );

  const teacherButton = document.getElementById(
    "teacherButton"
  );

  const teacherPanel = document.getElementById(
    "teacherPanel"
  );

  const closeTeacherPanelButton = document.getElementById(
    "closeTeacherPanel"
  );

  const teacherStartExerciseButton =
    document.getElementById("teacherStartExercise");

  const menuButton = document.getElementById("menuButton");

  const safetySidebar = document.getElementById(
    "safetySidebar"
  );

  const sidebarBackdrop = document.getElementById(
    "sidebarBackdrop"
  );

  const closeSafetySidebarButton = document.getElementById(
    "closeSafetySidebar"
  );

  const safetySidebarLinks = Array.from(
    safetySidebar.querySelectorAll("a")
  );

  const sidebarInformationLinks = Array.from(
    document.querySelectorAll(".sidebar-information-link")
  );

  const homeLink = document.getElementById("homeLink");

  function updatePageScroll() {
    const modalOpen = Boolean(
      document.querySelector(".modal.open")
    );

    const sidebarOpen =
      safetySidebar.classList.contains("open");

    const teacherPanelOpen =
      teacherPanel.classList.contains("open");

    document.body.style.overflow =
      modalOpen || sidebarOpen || teacherPanelOpen
        ? "hidden"
        : "";
  }

  function filterTopics() {
    const searchValue = helpSearch.value
      .trim()
      .toLowerCase();

    let visibleTopics = 0;

    topicCards.forEach((card) => {
      const searchableText = `
        ${card.dataset.title}
        ${card.dataset.description}
        ${card.textContent}
      `.toLowerCase();

      const matchesSearch =
        searchValue === "" ||
        searchableText.includes(searchValue);

      card.classList.toggle("hidden", !matchesSearch);

      if (matchesSearch) {
        visibleTopics += 1;
      }
    });

    noResults.hidden = visibleTopics !== 0;

    clearSearchButton.style.visibility =
      searchValue === "" ? "hidden" : "visible";
  }

  function openModal(modal) {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");

    updatePageScroll();
  }

  function closeModal(modal) {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");

    updatePageScroll();
  }

  function openSafetySidebar() {
    safetySidebar.classList.add("open");
    sidebarBackdrop.classList.add("open");

    safetySidebar.setAttribute("aria-hidden", "false");
    sidebarBackdrop.setAttribute("aria-hidden", "false");
    menuButton.setAttribute("aria-expanded", "true");

    updatePageScroll();
    closeSafetySidebarButton.focus();
  }

  function closeSafetySidebar() {
    safetySidebar.classList.remove("open");
    sidebarBackdrop.classList.remove("open");

    safetySidebar.setAttribute("aria-hidden", "true");
    sidebarBackdrop.setAttribute("aria-hidden", "true");
    menuButton.setAttribute("aria-expanded", "false");

    updatePageScroll();
  }

  function openTopic(card) {
    topicModalTitle.textContent =
      card.dataset.title || "Help topic";

    topicModalDescription.textContent =
      card.dataset.description ||
      "This topic is part of the classroom security lesson.";

    openModal(topicModal);
  }

  function updateClueScore() {
    const foundCount = clueItems.filter((item) =>
      item.classList.contains("found")
    ).length;

    clueScore.textContent = String(foundCount);
  }

  function highlightClue(clueName) {
    clickableClues.forEach((element) => {
      if (element.dataset.clue === clueName) {
        element.classList.add("clue-highlight");

        window.setTimeout(() => {
          element.classList.remove("clue-highlight");
        }, 1300);
      }
    });
  }

  function markClue(clueName) {
    const clueItem = clueItems.find(
      (item) => item.dataset.answer === clueName
    );

    if (!clueItem) {
      return;
    }

    clueItem.classList.add("found");

    highlightClue(clueName);
    updateClueScore();
  }

  function resetClues() {
    clueItems.forEach((item) => {
      item.classList.remove("found");
    });

    clickableClues.forEach((element) => {
      element.classList.remove("clue-highlight");
    });

    simulationForm.reset();
    updateClueScore();
  }

  function openSimulation() {
    resetClues();
    openModal(simulationModal);
  }

  function closeSimulation() {
    simulationForm.reset();
    closeModal(simulationModal);
  }

  function openTeacherPanel() {
    teacherPanel.classList.add("open");
    teacherPanel.setAttribute("aria-hidden", "false");

    updatePageScroll();
  }

  function closeTeacherPanel() {
    teacherPanel.classList.remove("open");
    teacherPanel.setAttribute("aria-hidden", "true");

    updatePageScroll();
  }

  helpSearch.addEventListener("input", filterTopics);

  clearSearchButton.addEventListener("click", () => {
    helpSearch.value = "";

    filterTopics();
    helpSearch.focus();
  });

  topicCards.forEach((card) => {
    card.addEventListener("click", () => {
      openTopic(card);
    });
  });

  document
    .querySelectorAll('[data-close-modal="topic"]')
    .forEach((button) => {
      button.addEventListener("click", () => {
        closeModal(topicModal);
      });
    });

  menuButton.addEventListener(
    "click",
    openSafetySidebar
  );

  closeSafetySidebarButton.addEventListener(
    "click",
    closeSafetySidebar
  );

  sidebarBackdrop.addEventListener(
    "click",
    closeSafetySidebar
  );

  safetySidebarLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeSafetySidebar();
    });
  });

  sidebarInformationLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
    });
  });

  openSimulationButton.addEventListener(
    "click",
    openSimulation
  );

  startExerciseButton.addEventListener(
    "click",
    openSimulation
  );

  closeSimulationButton.addEventListener(
    "click",
    closeSimulation
  );

  clickableClues.forEach((element) => {
    element.addEventListener("click", () => {
      markClue(element.dataset.clue);
    });

    element.addEventListener("keydown", (event) => {
      if (
        event.key === "Enter" ||
        event.key === " "
      ) {
        event.preventDefault();

        markClue(element.dataset.clue);
      }
    });
  });

  clueItems.forEach((item) => {
    item.addEventListener("click", () => {
      markClue(item.dataset.answer);
    });
  });

  revealCluesButton.addEventListener("click", () => {
    clueItems.forEach((item) => {
      markClue(item.dataset.answer);
    });
  });

  resetCluesButton.addEventListener(
    "click",
    resetClues
  );

  simulationForm.addEventListener("submit", (event) => {
    event.preventDefault();

    /*
      Safety protection:
      The values entered into the simulation are never read,
      stored, logged, displayed, or transmitted.
    */

    simulationForm.reset();

    closeModal(simulationModal);
    openModal(resultModal);
  });

  finishLessonButton.addEventListener("click", () => {
    closeModal(resultModal);
    resetClues();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  teacherButton.addEventListener(
    "click",
    openTeacherPanel
  );

  closeTeacherPanelButton.addEventListener(
    "click",
    closeTeacherPanel
  );

  teacherStartExerciseButton.addEventListener(
    "click",
    () => {
      closeTeacherPanel();
      openSimulation();
    }
  );

  homeLink.addEventListener("click", (event) => {
    event.preventDefault();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    if (resultModal.classList.contains("open")) {
      closeModal(resultModal);
      return;
    }

    if (simulationModal.classList.contains("open")) {
      closeSimulation();
      return;
    }

    if (topicModal.classList.contains("open")) {
      closeModal(topicModal);
      return;
    }

    if (safetySidebar.classList.contains("open")) {
      closeSafetySidebar();
      menuButton.focus();
      return;
    }

    if (teacherPanel.classList.contains("open")) {
      closeTeacherPanel();
    }
  });

  filterTopics();
  updateClueScore();
})();
