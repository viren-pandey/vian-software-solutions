document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll("form[action*='web3forms.com/submit']");
  forms.forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const required = form.querySelectorAll("[required]");
      for (const field of required) {
        if (!String(data.get(field.name) || "").trim()) {
          window.Vian.showToast("Please complete all required fields.");
          field.focus();
          return;
        }
      }
      const email = String(data.get("email") || "");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        window.Vian.showToast("Please enter a valid email address.");
        form.querySelector('[name="email"]')?.focus();
        return;
      }
      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: data,
        });
        const json = await res.json();
        if (json.success) {
          window.Vian.showToast("Your request has been submitted. Our team will get back to you shortly.");
          form.reset();
        } else {
          window.Vian.showToast("Submission failed. Please try again or email us directly.");
        }
      } catch {
        window.Vian.showToast("A network error occurred. Please try again.");
      }
    });
  });
});
