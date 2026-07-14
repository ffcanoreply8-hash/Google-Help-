(() => {
  "use strict";

  const form = document.getElementById("trainingForm");
  const modal = document.getElementById("trainingModal");
  const closeModalButton = document.getElementById("closeModal");
  const inspectButton = document.getElementById("inspectButton");
  const revealButton = document.getElementById("revealButton");
  const resetButton = document.getElementById("resetButton");
  const fakeHelpLink = document.getElementById("fakeHelpLink");

  const clueButtons = Array.from(
    document.querySelectorAll(".clue")
  );

  const scoreNumber = document.getElementById("scoreNumber");

  const clueClasses = {
    url: "highlight-url",
    urgency: "highlight-urgency",
    password: "highlight-password",
    branding: "highlight-branding",
    language: "highlight-language",
    link: "highlight-link"
  };

  let inspectIndex = 0;

  function updateScore() {
    const totalFound = clueButtons.filter((button) =>
      button.classList.contains("found")
    ).length;

    scoreNumber.textContent = String(totalFound);
  }

  function markClue(button) {
    const clueName = button.dataset.clue;
    const className = clueClasses[clueName];

    button.classList.add("found");

    if (className) {
      document.body.classList.add(className);

      window.setTimeout(() => {
        document.body.classList.remove(className);
      }, 1300);
    }

    updateScore();
  }

  function openModal() {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    closeModalButton.focus();
  }

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");

    form.reset();
    inspectButton.focus();
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    /*
      Safety:
      This demonstration never reads, stores, logs,
      or sends the information entered into the fields.
    */

    form.reset();
    openModal();
  });

  fakeHelpLink.addEventListener("click", (event) => {
    event.preventDefault();

    const matchingClue = clueButtons.find(
      (button) => button.dataset.clue === "link"
    );

    if (matchingClue) {
      markClue(matchingClue);
    }

    openModal();
  });

  clueButtons.forEach((button) => {
    button.addEventListener("click", () => {
      markClue(button);
    });
  });

  inspectButton.addEventListener("click", () => {
    const button =
      clueButtons[inspectIndex % clueButtons.length];

    markClue(button);

    button.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });

    inspectIndex += 1;
  });

  revealButton.addEventListener("click", () => {
    clueButtons.forEach(markClue);
  });

  resetButton.addEventListener("click", () => {
    clueButtons.forEach((button) => {
      button.classList.remove("found");
    });

    Object.values(clueClasses).forEach((className) => {
      document.body.classList.remove(className);
    });

    inspectIndex = 0;

    form.reset();
    updateScore();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  closeModalButton.addEventListener("click", closeModal);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      modal.classList.contains("open")
    ) {
      closeModal();
    }
  });

  updateScore();
})();
