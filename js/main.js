/* ============================================================
   Hotel OS — Website interactions
   Mobile nav · sticky state · reveal · tabs · FAQ · demo form
   ============================================================ */
(function () {
  "use strict";

  /* ----------------------------------------------------------
     Demo form destination — CONFIGURATION REQUIRED.
     Leave FORM_ENDPOINT empty ("") until a real endpoint exists:
       - Formspree:  "https://formspree.io/f/XXXXXXX"
       - Getform / Basin / own API: any URL accepting POST JSON.
     While empty, submissions are NOT sent and NO success is shown;
     the visitor sees a clear "not configured yet" message + mailto.
     NEVER fake a successful submission.
     ---------------------------------------------------------- */
  var FORM_ENDPOINT = ""; // TODO: configure before production
  var FALLBACK_EMAIL = "hello@hotelos.example"; // TODO: verified contact email

  /* ---------- Sticky navbar state ---------- */
  var navbar = document.getElementById("navbar");

  function onScroll() {
    if (!navbar) return;
    navbar.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile navigation ---------- */
  var toggle = document.getElementById("nav-toggle");
  var links = document.getElementById("nav-links");

  function closeMenu() {
    if (!toggle || !links) return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    links.classList.remove("is-open");
    navbar && navbar.classList.remove("is-open");
  }

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      toggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
      links.classList.toggle("is-open", !open);
      navbar && navbar.classList.toggle("is-open", !open);
    });

    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 820) closeMenu();
    });
  }

  /* ---------- Active nav link on scroll ---------- */
  var navAnchors = Array.prototype.slice.call(
    document.querySelectorAll(".nav-links .nav-link")
  );
  var watched = navAnchors
    .map(function (a) {
      return document.querySelector(a.getAttribute("href"));
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && watched.length) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = "#" + entry.target.id;
          navAnchors.forEach(function (a) {
            a.classList.toggle("is-active", a.getAttribute("href") === id);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    watched.forEach(function (sec) { spy.observe(sec); });
  }

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Product showcase tabs ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".showcase-tabs .tab"));
  var panels = Array.prototype.slice.call(document.querySelectorAll(".showcase-panel"));

  function activateTab(tab) {
    tabs.forEach(function (t) {
      var active = t === tab;
      t.classList.toggle("is-active", active);
      t.setAttribute("aria-selected", String(active));
      t.tabIndex = active ? 0 : -1;
    });
    panels.forEach(function (p) {
      var match = p.id === tab.getAttribute("data-panel");
      p.classList.toggle("is-active", match);
      if (match) p.removeAttribute("hidden");
      else p.setAttribute("hidden", "");
    });
  }

  tabs.forEach(function (tab, i) {
    tab.tabIndex = i === 0 ? 0 : -1;
    tab.addEventListener("click", function () { activateTab(tab); });
    tab.addEventListener("keydown", function (e) {
      var dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!dir) return;
      e.preventDefault();
      var next = tabs[(i + dir + tabs.length) % tabs.length];
      next.focus();
      activateTab(next);
    });
  });

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var expanded = btn.getAttribute("aria-expanded") === "true";
      var panel = document.getElementById(btn.getAttribute("aria-controls"));
      var item = btn.closest(".faq-item");

      // Close others (single-open accordion)
      document.querySelectorAll(".faq-q").forEach(function (other) {
        if (other === btn) return;
        other.setAttribute("aria-expanded", "false");
        var op = document.getElementById(other.getAttribute("aria-controls"));
        if (op) op.setAttribute("hidden", "");
        var oi = other.closest(".faq-item");
        if (oi) oi.classList.remove("is-open");
      });

      btn.setAttribute("aria-expanded", String(!expanded));
      if (panel) {
        if (expanded) panel.setAttribute("hidden", "");
        else panel.removeAttribute("hidden");
      }
      if (item) item.classList.toggle("is-open", !expanded);
    });
  });

  /* ---------- Demo form ---------- */
  var form = document.getElementById("demo-form");
  if (form) {
    var submitBtn = document.getElementById("form-submit");
    var statusEl = document.getElementById("form-status");
    var labelEl = submitBtn && submitBtn.querySelector(".btn-label");
    var spinnerEl = submitBtn && submitBtn.querySelector(".btn-spinner");

    var validators = {
      "f-name": function (v) {
        if (!v.trim()) return "Please enter your full name.";
        if (v.trim().length < 2) return "Name is too short.";
        return "";
      },
      "f-hotel": function (v) {
        return v.trim() ? "" : "Please enter your hotel name.";
      },
      "f-email": function (v) {
        if (!v.trim()) return "Please enter your email address.";
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
          ? ""
          : "Please enter a valid email address.";
      },
      "f-phone": function (v) {
        if (!v.trim()) return "Please enter your phone number.";
        var digits = v.replace(/[^\d]/g, "");
        return digits.length >= 7 && digits.length <= 15
          ? ""
          : "Please enter a valid phone number.";
      },
      "f-location": function (v) {
        return v.trim() ? "" : "Please enter your hotel location.";
      },
      "f-rooms": function (v) {
        if (!v.trim()) return "";
        var n = Number(v);
        return Number.isInteger(n) && n >= 1 && n <= 10000
          ? ""
          : "Enter a valid number of rooms.";
      },
      "f-message": function () { return ""; }
    };

    function setError(id, msg) {
      var input = document.getElementById(id);
      var err = form.querySelector('.field-error[data-for="' + id + '"]');
      if (input) input.classList.toggle("is-invalid", Boolean(msg));
      if (input) input.setAttribute("aria-invalid", msg ? "true" : "false");
      if (err) err.textContent = msg;
    }

    function validateField(id) {
      var input = document.getElementById(id);
      if (!input || !validators[id]) return true;
      var msg = validators[id](input.value);
      setError(id, msg);
      return !msg;
    }

    Object.keys(validators).forEach(function (id) {
      var input = document.getElementById(id);
      if (!input) return;
      input.addEventListener("blur", function () { validateField(id); });
      input.addEventListener("input", function () {
        if (input.classList.contains("is-invalid")) validateField(id);
      });
    });

    function setStatus(msg, kind) {
      if (!statusEl) return;
      statusEl.textContent = msg;
      statusEl.className = "form-status" + (kind ? " is-" + kind : "");
    }

    function setBusy(busy) {
      if (!submitBtn) return;
      submitBtn.disabled = busy;
      if (labelEl) labelEl.textContent = busy ? "Sending…" : "Request a Demo";
      if (spinnerEl) spinnerEl.hidden = !busy;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      setStatus("", "");

      // Honeypot — silently accept bot submissions without network call
      var honeypot = document.getElementById("f-company");
      if (honeypot && honeypot.value) return;

      var allOk = true;
      var firstBad = null;
      Object.keys(validators).forEach(function (id) {
        var ok = validateField(id);
        if (!ok && !firstBad) firstBad = document.getElementById(id);
        allOk = allOk && ok;
      });

      if (!allOk) {
        setStatus("Please correct the highlighted fields.", "error");
        if (firstBad) firstBad.focus();
        return;
      }

      // Destination not configured — honest state, no fake success
      if (!FORM_ENDPOINT) {
        setStatus(
          "The demo form is not connected yet. Please email us directly while we finish configuration.",
          "info"
        );
        var mail = document.getElementById("f-email");
        var subject = encodeURIComponent("Hotel OS demo request — " + (document.getElementById("f-hotel") || {}).value);
        var body = encodeURIComponent(
          "Name: " + (document.getElementById("f-name") || {}).value + "\n" +
          "Hotel: " + (document.getElementById("f-hotel") || {}).value + "\n" +
          "Email: " + (mail || {}).value + "\n" +
          "Phone: " + (document.getElementById("f-phone") || {}).value + "\n" +
          "Location: " + (document.getElementById("f-location") || {}).value + "\n" +
          "Rooms: " + (document.getElementById("f-rooms") || {}).value + "\n\n" +
          (document.getElementById("f-message") || {}).value
        );
        window.location.href =
          "mailto:" + FALLBACK_EMAIL + "?subject=" + subject + "&body=" + body;
        return;
      }

      // Real submission — success only after confirmed response
      setBusy(true);
      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });

      fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data)
      })
        .then(function (res) {
          if (!res.ok) throw new Error("Request failed: " + res.status);
          form.reset();
          setStatus("Thank you — your demo request has been received. Our team will be in touch.", "success");
        })
        .catch(function () {
          setStatus("Something went wrong sending your request. Please try again or email us directly.", "error");
        })
        .finally(function () { setBusy(false); });
    });
  }
})();
