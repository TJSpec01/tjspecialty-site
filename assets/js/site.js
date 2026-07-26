/* TJ Specialty Construction — mobile nav, dropdowns, gallery lightbox */
(function () {
  "use strict";

  /* ---------- mobile nav ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".site-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  /* ---------- dropdown menus ---------- */
  var subs = Array.prototype.slice.call(document.querySelectorAll(".has-sub"));

  function closeAll(except) {
    subs.forEach(function (s) {
      if (s !== except) {
        s.dataset.open = "false";
        var t = s.querySelector(".has-sub__toggle");
        if (t) t.setAttribute("aria-expanded", "false");
      }
    });
  }

  subs.forEach(function (sub) {
    var btn = sub.querySelector(".has-sub__toggle");
    if (!btn) return;

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = sub.dataset.open !== "true";
      closeAll(sub);
      sub.dataset.open = String(open);
      btn.setAttribute("aria-expanded", String(open));
    });

    // hover only on pointer devices with room for a dropdown
    if (window.matchMedia("(min-width: 1025px)").matches) {
      sub.addEventListener("mouseenter", function () {
        closeAll(sub);
        sub.dataset.open = "true";
        btn.setAttribute("aria-expanded", "true");
      });
      sub.addEventListener("mouseleave", function () {
        sub.dataset.open = "false";
        btn.setAttribute("aria-expanded", "false");
      });
    }
  });

  document.addEventListener("click", function () { closeAll(null); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeAll(null);
      if (document.body.classList.contains("nav-open") && toggle) toggle.click();
      closeLightbox();
    }
  });

  /* ---------- forms: resolve the post-submit redirect to this origin ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('input[name="_next"][data-path]'), function (input) {
    try {
      input.value = new URL(input.dataset.path, location.href).href;
    } catch (e) {
      /* keep the build-time default */
    }
  });

  /* ---------- gallery lightbox ---------- */
  var items = Array.prototype.slice.call(document.querySelectorAll(".gallery__item"));
  if (!items.length) return;

  var box = document.createElement("div");
  box.className = "lightbox";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.setAttribute("aria-label", "Project photo viewer");
  box.innerHTML =
    '<button class="lightbox__btn lightbox__close" aria-label="Close">&times;</button>' +
    '<button class="lightbox__btn lightbox__prev" aria-label="Previous photo">&#8249;</button>' +
    '<img alt="">' +
    '<button class="lightbox__btn lightbox__next" aria-label="Next photo">&#8250;</button>' +
    '<p class="lightbox__count"></p>';
  document.body.appendChild(box);

  var img = box.querySelector("img");
  var count = box.querySelector(".lightbox__count");
  var index = 0;
  var lastFocus = null;

  function show(i) {
    index = (i + items.length) % items.length;
    var source = items[index].querySelector("img");
    img.src = source.dataset.full || source.src;
    img.alt = source.alt || "";
    count.textContent = index + 1 + " / " + items.length;
  }

  function openLightbox(i) {
    lastFocus = document.activeElement;
    show(i);
    box.dataset.open = "true";
    document.body.style.overflow = "hidden";
    box.querySelector(".lightbox__close").focus();
  }

  function closeLightbox() {
    if (box.dataset.open !== "true") return;
    box.dataset.open = "false";
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }

  items.forEach(function (item, i) {
    item.addEventListener("click", function () { openLightbox(i); });
  });

  box.querySelector(".lightbox__close").addEventListener("click", closeLightbox);
  box.querySelector(".lightbox__prev").addEventListener("click", function (e) {
    e.stopPropagation();
    show(index - 1);
  });
  box.querySelector(".lightbox__next").addEventListener("click", function (e) {
    e.stopPropagation();
    show(index + 1);
  });
  box.addEventListener("click", function (e) { if (e.target === box) closeLightbox(); });

  document.addEventListener("keydown", function (e) {
    if (box.dataset.open !== "true") return;
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });
})();
