(() => {
  "use strict";

  const byId = (id) => document.getElementById(id);
  const all = (selector) => Array.from(document.querySelectorAll(selector));

  const helpSearch = byId("helpSearch");
  const clearSearchButton = byId("clearSearch");
  const topicCards = all(".topic-card");
  const noResults = byId("noResults");

  const topicModal = byId("topicModal");
  const topicModalTitle = byId("topicModalTitle");
  const topicModalDescription = byId("topicModalDescription");

  const simulationModal = byId("simulationModal");
  const simulationForm = byId("simulationForm");
  const openSimulationButton = byId("openSimulation");
  const startExerciseButton = byId("startExercise");
  const closeSimulationButton = byId("closeSimulation");

  const clueItems = all(".clue-item");
  const clickableClues = all(".clickable-clue");
  const clueScore = byId("clueScore");
  const revealCluesButton = byId("revealClues");
  const resetCluesButton = byId("resetClues");

  const assessmentModal = byId("assessmentModal");
  const assessmentForm = byId("assessmentForm");
  const closeAssessmentButton = byId("closeAssessment");

  const resultModal = byId("resultModal");
  const finishLessonButton = byId("finishLesson");

  const teacherButton = byId("teacherButton");
  const teacherPanel = byId("teacherPanel");
  const closeTeacherPanelButton = byId("closeTeacherPanel");
  const teacherStartExerciseButton = byId("teacherStartExercise");

  const menuButton = byId("menuButton");
  const safetySidebar = byId("safetySidebar");
  const sidebarBackdrop = byId("sidebarBackdrop");
  const closeSafetySidebarButton = byId("closeSafetySidebar");
  const safetySidebarLinks = safetySidebar
    ? Array.from(safetySidebar.querySelectorAll("a"))
    : [];
  const sidebarInfoLinks = all(".sidebar-info-link");

  const homeLink = byId("homeLink");

  /*
    Supabase configuration:
    Use only your Project URL and Publishable key.
    Never place a Secret or service_role key in browser code.
  */
  const SUPABASE_URL =
    "https://haiakddrdcpzccyqhznt.supabase.co";

  const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_KLPB6bHWHMvXRXmenj8yyw_WEh_ADT9";

  const supabaseClient =
    window.supabase?.createClient(
      SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY
    );

  function pageHasOpenLayer() {
    return Boolean(
      document.querySelector(".modal.open") ||
      safetySidebar?.classList.contains("open") ||
      teacherPanel?.classList.contains("open")
    );
  }

  function updatePageScroll() {
    document.body.style.overflow = pageHasOpenLayer()
      ? "hidden"
      : "";
  }

  function openModal(modal) {
    if (!modal) {
      return;
    }

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    updatePageScroll();
  }

  function closeModal(modal) {
    if (!modal) {
      return;
    }

    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    updatePageScroll();
  }

  function filterTopics() {
    if (!helpSearch || !noResults || !clearSearchButton) {
      return;
    }

    const searchValue = helpSearch.value.trim().toLowerCase();
    let visibleTopics = 0;

    topicCards.forEach((card) => {
      const searchableText = `
        ${card.dataset.title || ""}
        ${card.dataset.description || ""}
        ${card.textContent || ""}
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

  function showInformation(title, description) {
    if (!topicModal || !topicModalTitle || !topicModalDescription) {
      return;
    }

    topicModalTitle.textContent = title || "Help topic";
    topicModalDescription.textContent =
      description ||
      "This topic is part of the classroom security lesson.";

    openModal(topicModal);
  }

  function openTopic(card) {
    showInformation(
      card.dataset.title,
      card.dataset.description
    );
  }

  function openSafetySidebar() {
    if (
      !safetySidebar ||
      !sidebarBackdrop ||
      !menuButton
    ) {
      return;
    }

    safetySidebar.classList.add("open");
    sidebarBackdrop.classList.add("open");

    safetySidebar.setAttribute("aria-hidden", "false");
    sidebarBackdrop.setAttribute("aria-hidden", "false");
    menuButton.setAttribute("aria-expanded", "true");

    updatePageScroll();
    closeSafetySidebarButton?.focus();
  }

  function closeSafetySidebar() {
    if (
      !safetySidebar ||
      !sidebarBackdrop ||
      !menuButton
    ) {
      return;
    }

    safetySidebar.classList.remove("open");
    sidebarBackdrop.classList.remove("open");

    safetySidebar.setAttribute("aria-hidden", "true");
    sidebarBackdrop.setAttribute("aria-hidden", "true");
    menuButton.setAttribute("aria-expanded", "false");

    updatePageScroll();
  }

  function updateClueScore() {
    if (!clueScore) {
      return;
    }

    const foundCount = clueItems.filter((item) =>
      item.classList.contains("found")
    ).length;

    clueScore.textContent = String(foundCount);
  }

  function highlightClue(clueName) {
    clickableClues.forEach((element) => {
      if (element.dataset.clue !== clueName) {
        return;
      }

      element.classList.add("clue-highlight");

      window.setTimeout(() => {
        element.classList.remove("clue-highlight");
      }, 1300);
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

    simulationForm?.reset();
    updateClueScore();
  }

  function openSimulation() {
    resetClues();
    openModal(simulationModal);
  }

  function closeSimulation() {
    simulationForm?.reset();
    closeModal(simulationModal);
  }

  function openTeacherPanel() {
    if (!teacherPanel) {
      return;
    }

    teacherPanel.classList.add("open");
    teacherPanel.setAttribute("aria-hidden", "false");
    updatePageScroll();
  }

  function closeTeacherPanel() {
    if (!teacherPanel) {
      return;
    }

    teacherPanel.classList.remove("open");
    teacherPanel.setAttribute("aria-hidden", "true");
    updatePageScroll();
  }

  helpSearch?.addEventListener("input", filterTopics);

  clearSearchButton?.addEventListener("click", () => {
    if (!helpSearch) {
      return;
    }

    helpSearch.value = "";
    filterTopics();
    helpSearch.focus();
  });

  topicCards.forEach((card) => {
    card.addEventListener("click", () => {
      openTopic(card);
    });
  });

  all('[data-close-modal="topic"]').forEach((button) => {
    button.addEventListener("click", () => {
      closeModal(topicModal);
    });
  });

  menuButton?.addEventListener("click", openSafetySidebar);
  closeSafetySidebarButton?.addEventListener(
    "click",
    closeSafetySidebar
  );
  sidebarBackdrop?.addEventListener(
    "click",
    closeSafetySidebar
  );

  safetySidebarLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeSafetySidebar();
    });
  });

  sidebarInfoLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      closeSafetySidebar();

      window.setTimeout(() => {
        showInformation(
          link.dataset.title,
          link.dataset.description
        );
      }, 220);
    });
  });

  openSimulationButton?.addEventListener(
    "click",
    openSimulation
  );
  startExerciseButton?.addEventListener(
    "click",
    openSimulation
  );
  closeSimulationButton?.addEventListener(
    "click",
    closeSimulation
  );

  clickableClues.forEach((element) => {
    element.addEventListener("click", () => {
      markClue(element.dataset.clue);
    });

    element.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
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

  revealCluesButton?.addEventListener("click", () => {
    clueItems.forEach((item) => {
      markClue(item.dataset.answer);
    });
  });

  resetCluesButton?.addEventListener("click", resetClues);

  simulationForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    /*
      The values entered into the simulated login form are
      never read, saved, logged, displayed, or transmitted.
    */

    simulationForm.reset();
    closeModal(simulationModal);
    openModal(assessmentModal);

    window.setTimeout(() => {
      byId("malwareAnswer")?.focus();
    }, 0);
  });

  closeAssessmentButton?.addEventListener("click", () => {
    assessmentForm?.reset();
    closeModal(assessmentModal);
  });

  all('[data-close-modal="assessment"]').forEach((element) => {
    element.addEventListener("click", () => {
      assessmentForm?.reset();
      closeModal(assessmentModal);
    });
  });

  assessmentForm?.addEventListener(
    "submit",
    async (event) => {
      event.preventDefault();

      if (!assessmentForm.reportValidity()) {
        return;
      }

      if (!supabaseClient) {
        window.alert(
          "Supabase is not configured correctly."
        );
        return;
      }

      const submitButton =
        assessmentForm.querySelector(
          'button[type="submit"]'
        );

      const originalButtonText =
        submitButton?.textContent || "Submit";

      const responseData = {
        malware_answer:
          byId("malwareAnswer")?.value.trim() || "",
        phishing_answer:
          byId("phishingAnswer")?.value.trim() || "",
        awareness_answer:
          byId("awarenessAnswer")?.value.trim() || "",
        improvement_answer:
          byId("improvementAnswer")?.value.trim() || ""
      };

      if (
        Object.values(responseData).some(
          (answer) => answer.length === 0
        )
      ) {
        window.alert(
          "Please answer all four questions."
        );
        return;
      }

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Submitting...";
      }

      try {
        const { error } = await supabaseClient
          .from("awareness_responses")
          .insert(responseData);

        if (error) {
          throw error;
        }

        assessmentForm.reset();
        closeModal(assessmentModal);
        openModal(resultModal);
      } catch (error) {
        console.error(
          "Supabase submission failed:",
          error
        );

        window.alert(
          "Your answers could not be submitted. Please try again."
        );
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent =
            originalButtonText;
        }
      }
    }
  );

  finishLessonButton?.addEventListener("click", () => {
    closeModal(resultModal);
    resetClues();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  teacherButton?.addEventListener(
    "click",
    openTeacherPanel
  );

  closeTeacherPanelButton?.addEventListener(
    "click",
    closeTeacherPanel
  );

  teacherStartExerciseButton?.addEventListener(
    "click",
    () => {
      closeTeacherPanel();
      openSimulation();
    }
  );

  homeLink?.addEventListener("click", (event) => {
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

    if (resultModal?.classList.contains("open")) {
      closeModal(resultModal);
      return;
    }

    if (assessmentModal?.classList.contains("open")) {
      assessmentForm?.reset();
      closeModal(assessmentModal);
      return;
    }

    if (simulationModal?.classList.contains("open")) {
      closeSimulation();
      return;
    }

    if (topicModal?.classList.contains("open")) {
      closeModal(topicModal);
      return;
    }

    if (safetySidebar?.classList.contains("open")) {
      closeSafetySidebar();
      menuButton?.focus();
      return;
    }

    if (teacherPanel?.classList.contains("open")) {
      closeTeacherPanel();
    }
  });

  filterTopics();
  updateClueScore();
})();
