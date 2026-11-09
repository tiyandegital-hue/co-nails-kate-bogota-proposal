/* Nails Kate — shared interactions: mobile nav, gallery filters,
   sticky step fill, booking + contact forms -> WhatsApp. */
(function () {
  "use strict";
  var WA_NUMBER = "573229177574";
  var waUrl = function (msg) {
    return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(msg);
  };

  /* ---- Mobile nav ---- */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("open");
        toggle.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---- Gallery filters ---- */
  var pills = document.querySelectorAll("[data-filter]");
  var tiles = document.querySelectorAll(".tile[data-cat]");
  if (pills.length && tiles.length) {
    pills.forEach(function (pill) {
      pill.addEventListener("click", function () {
        var f = pill.getAttribute("data-filter");
        pills.forEach(function (p) { p.setAttribute("aria-pressed", p === pill ? "true" : "false"); });
        tiles.forEach(function (t) {
          var cats = (t.getAttribute("data-cat") || "").split(" ");
          var show = f === "todos" || cats.indexOf(f) !== -1;
          t.classList.toggle("is-hidden", !show);
        });
      });
    });
  }

  /* ---- Sticky step fill on Agenda ---- */
  var steps = document.querySelectorAll(".step");
  if (steps.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) entry.target.classList.add("in-view");
      });
    }, { threshold: 0.35 });
    steps.forEach(function (s) { io.observe(s); });
  } else {
    steps.forEach(function (s) { s.classList.add("in-view"); });
  }

  /* ---- Booking form (Agenda) ---- */
  var book = document.getElementById("booking-form");
  if (book) {
    book.addEventListener("submit", function (e) {
      e.preventDefault();
      var err = document.getElementById("form-error");
      var nombre = document.getElementById("f-nombre").value.trim();
      var servicio = document.getElementById("f-servicio").value;
      var fecha = document.getElementById("f-fecha").value;
      var zona = document.getElementById("f-zona").value.trim();
      var mensaje = document.getElementById("f-mensaje").value.trim();
      var consent = document.getElementById("f-consent").checked;
      var problems = [];
      if (!nombre) problems.push("tu nombre");
      if (!servicio) problems.push("un servicio");
      if (!fecha) problems.push("una fecha preferida");
      if (!zona) problems.push("tu barrio o zona en Bogotá");
      if (!consent) problems.push("aceptar el uso de tus datos para confirmar la cita");
      if (problems.length) {
        err.textContent = "Falta: " + problems.join(", ") + ". Completa esos campos para continuar.";
        err.classList.add("show");
        err.setAttribute("tabindex", "-1");
        err.focus();
        return;
      }
      err.classList.remove("show");
      var lines = [
        "Hola Kate, quiero agendar una cita.",
        "Nombre: " + nombre,
        "Servicio: " + servicio,
        "Fecha preferida: " + fecha,
        "Barrio o zona: " + zona
      ];
      if (mensaje) lines.push("Mensaje: " + mensaje);
      window.open(waUrl(lines.join("\n")), "_blank", "noopener");
    });
  }

  /* ---- Contact form ---- */
  var contact = document.getElementById("contact-form");
  if (contact) {
    contact.addEventListener("submit", function (e) {
      e.preventDefault();
      var err = document.getElementById("contact-error");
      var nombre = document.getElementById("c-nombre").value.trim();
      var servicio = document.getElementById("c-servicio").value;
      var mensaje = document.getElementById("c-mensaje").value.trim();
      var problems = [];
      if (!nombre) problems.push("tu nombre");
      if (!servicio) problems.push("un servicio");
      if (!mensaje) problems.push("tu mensaje");
      if (problems.length) {
        err.textContent = "Falta: " + problems.join(", ") + ". Completa esos campos para continuar.";
        err.classList.add("show");
        err.setAttribute("tabindex", "-1");
        err.focus();
        return;
      }
      err.classList.remove("show");
      var lines = [
        "Hola Kate, soy " + nombre + ".",
        "Servicio: " + servicio,
        "Mensaje: " + mensaje
      ];
      window.open(waUrl(lines.join("\n")), "_blank", "noopener");
    });
  }
})();
