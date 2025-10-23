/* assets/app.js */
(() => {
  const form = document.getElementById("contactForm");
  if (!form) return;

  // elements
  const nameInput = document.querySelector('[data-testid="input-name"]');
  const emailInput = document.querySelector('[data-testid="input-email"]');
  const subjectInput = document.querySelector('[data-testid="input-subject"]');
  const messageInput = document.querySelector('[data-testid="input-message"]');
  const statusEl = document.getElementById("formStatus");
  const errorName = document.querySelector('[data-testid="error-name"]');
  const errorEmail = document.querySelector('[data-testid="error-email"]');
  const errorSubject = document.querySelector('[data-testid="error-subject"]');
  const errorMessage = document.querySelector('[data-testid="error-message"]');
  const resetBtn = document.querySelector('[data-testid="btn-reset"]');
  const submitBtn = document.querySelector('[data-testid="btn-submit"]');

  // validators
  const validators = {
    name: (v) => {
      if (!v || !v.trim()) return "Name is required.";
      if (v.trim().length < 2) return "Name must be at least 2 characters.";
      return "";
    },
    email: (v) => {
      if (!v || !v.trim()) return "Email is required.";
      // robust-ish email check
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
      if (!re.test(v.trim())) return "Enter a valid email address.";
      return "";
    },
    subject: (v) => {
      if (!v || !v.trim()) return "Subject is required.";
      if (v.trim().length < 3) return "Subject must be at least 3 characters.";
      return "";
    },
    message: (v) => {
      if (!v || !v.trim()) return "Message is required.";
      if (v.trim().length < 10)
        return "Message must be at least 10 characters.";
      return "";
    },
  };

  // show error helper
  function showError(el, text, inputEl) {
    el.textContent = text;
    if (text) {
      inputEl.setAttribute("aria-invalid", "true");
      inputEl.classList.add("invalid");
    } else {
      inputEl.removeAttribute("aria-invalid");
      inputEl.classList.remove("invalid");
    }
  }

  // realtime validation
  function validateField(field) {
    let val = field.value;
    let key = field.name;
    let err = validators[key](val);
    switch (key) {
      case "name":
        showError(errorName, err, nameInput);
        break;
      case "email":
        showError(errorEmail, err, emailInput);
        break;
      case "subject":
        showError(errorSubject, err, subjectInput);
        break;
      case "message":
        showError(errorMessage, err, messageInput);
        break;
    }
    return err === "";
  }

  [nameInput, emailInput, subjectInput, messageInput].forEach((inp) => {
    inp.addEventListener("input", (e) => {
      validateField(e.currentTarget);
      statusEl.textContent = ""; // clear status on change
    });

    // also validate on blur to help keyboard users
    inp.addEventListener("blur", (e) => validateField(e.currentTarget));
  });

  // form submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    statusEl.textContent = "";

    // validate all
    const okName = validateField(nameInput);
    const okEmail = validateField(emailInput);
    const okSubject = validateField(subjectInput);
    const okMessage = validateField(messageInput);

    if (!(okName && okEmail && okSubject && okMessage)) {
      statusEl.textContent = "Please fix errors above before sending.";
      statusEl.style.color = "#b91c1c";
      return;
    }

    // simulate sending
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    // Simulated network request
    setTimeout(() => {
      // success
      statusEl.textContent =
        "Message sent successfully! Thank you — you will receive a reply at your email.";
      statusEl.style.color = "#065f46"; // greenish
      form.reset();
      // clear errors
      [errorName, errorEmail, errorSubject, errorMessage].forEach(
        (el) => (el.textContent = "")
      );
      submitBtn.disabled = false;
      submitBtn.textContent = "Send message";

      // Optionally: create a mailto link in case user wants to send actual email
      const mailto = `mailto:youremail@example.com?subject=${encodeURIComponent(
        subjectInput.value || "Contact"
      )}&body=${encodeURIComponent(
        "From: " + (nameInput.value || "") + "\n\n" + (messageInput.value || "")
      )}`;
      // leave it unused — mentors only expect front-end behaviour.
    }, 900);
  });

  // reset button
  resetBtn.addEventListener("click", () => {
    form.reset();
    [errorName, errorEmail, errorSubject, errorMessage].forEach(
      (el) => (el.textContent = "")
    );
    statusEl.textContent = "";
    nameInput.focus();
  });

  // allow enter key to submit when focused in textarea? default is fine.
})();
