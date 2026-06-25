document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-contact-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const required = ["name", "email", "message"];
      const missing = required.find((field) => !String(data.get(field) || "").trim());
      const email = String(data.get("email") || "");

      if (missing) {
        window.Vian.showToast("Please complete the required fields.");
        form.querySelector(`[name="${missing}"]`)?.focus();
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        window.Vian.showToast("Please enter a valid business email address.");
        form.querySelector('[name="email"]')?.focus();
        return;
      }

      window.Vian.showToast("Your request has been submitted. Our team will get back to you shortly.");
      form.reset();
    });
  });
});
