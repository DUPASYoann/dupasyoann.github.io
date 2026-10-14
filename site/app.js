const $ = (selector) => document.querySelector(selector);
const ui = JSON.parse($("#ui-data").textContent);
document.documentElement.classList.add("js");
const themeButton = $(".theme-toggle");
function syncTheme() {
  themeButton.setAttribute("aria-pressed", String(document.documentElement.dataset.theme === "dark"));
}
syncTheme();
themeButton.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem("yd-theme", next);
  } catch {
    /* Storage can be disabled. */
  }
  syncTheme();
});
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
  let saved;
  try {
    saved = localStorage.getItem("yd-theme");
  } catch {
    /* Use system preference. */
  }
  if (!saved) {
    document.documentElement.dataset.theme = event.matches ? "dark" : "light";
    syncTheme();
  }
});

const menuButton = $(".menu-toggle");
function closeMenu() {
  menuButton.setAttribute("aria-expanded", "false");
  $(".site-header").classList.remove("menu-open");
}
menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(open));
  $(".site-header").classList.toggle("menu-open", open);
});
$("#main-nav").addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
    menuButton.blur();
  }
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".site-header")) closeMenu();
});
matchMedia("(min-width: 901px)").addEventListener("change", closeMenu);

const search = $("#pub-search");
if (search) {
  const year = $("#pub-year");
  const normalize = (text) =>
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  const rows = [...document.querySelectorAll(".publication")];
  function filter() {
    const terms = normalize(search.value).trim().split(/\s+/).filter(Boolean);
    let count = 0;
    for (const row of rows) {
      const visible =
        (year.value === "all" || row.dataset.year === year.value) && terms.every((term) => normalize(row.dataset.search).includes(term));
      row.hidden = !visible;
      if (visible) count++;
    }
    $("#result-count").textContent = count;
    $("#empty-state").hidden = count !== 0;
    const params = new URLSearchParams();
    if (search.value.trim()) params.set("q", search.value.trim());
    if (year.value !== "all") params.set("year", year.value);
    history.replaceState(null, "", `${location.pathname}${params.size ? `?${params}` : ""}`);
  }
  const params = new URLSearchParams(location.search);
  search.value = params.get("q") || "";
  const requestedYear = params.get("year");
  if ([...year.options].some((o) => o.value === requestedYear)) year.value = requestedYear;
  filter();
  search.addEventListener("input", filter);
  year.addEventListener("change", filter);
  $(".publication-filters").addEventListener("submit", (event) => event.preventDefault());
  $("#reset-filters").addEventListener("click", () => {
    search.value = "";
    year.value = "all";
    filter();
    search.focus();
  });
}

const citations = JSON.parse($("#citation-data").textContent);
const dialog = $("#citation-dialog");
let citationTrigger;
for (const button of document.querySelectorAll("[data-cite]"))
  button.addEventListener("click", () => {
    citationTrigger = button;
    $("#citation-text").textContent = citations[button.dataset.cite];
    $(".copy-status").textContent = "";
    dialog.showModal();
  });
$(".close-dialog").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) {
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  }
});
dialog.addEventListener("close", () => citationTrigger?.focus());
async function copyText(text, status) {
  try {
    await navigator.clipboard.writeText(text);
    status.textContent = ui.copied;
  } catch {
    status.textContent = ui.copyFailed;
    const selectable = dialog.open ? $("#citation-text") : $(".email-link");
    const selection = getSelection();
    const range = document.createRange();
    range.selectNodeContents(selectable);
    selection.removeAllRanges();
    selection.addRange(range);
  }
}
$(".copy-citation").addEventListener("click", () => copyText($("#citation-text").textContent, $(".copy-status")));
let toastTimer;
$(".copy-email")?.addEventListener("click", async (event) => {
  const toast = $(".toast");
  await copyText(event.currentTarget.dataset.email, toast);
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 3500);
});
$(".print-button")?.addEventListener("click", () => window.print());

// Preserve the selected language when navigating between translated publication searches.
const langLink = $(".language-switch");
if (search)
  langLink.addEventListener("click", () => {
    langLink.search = location.search;
  });
else
  langLink.addEventListener("click", () => {
    langLink.hash = location.hash;
  });

const demo = $(".perception-demo");
if (demo) {
  const explanations = JSON.parse($("#demo-copy").textContent);
  const modes = ["rgb", "ir", "lidar", "fusion"];
  const mix = $("#sensor-mix");
  for (const button of demo.querySelectorAll("[data-mode-button]"))
    button.addEventListener("click", () => {
      const mode = button.dataset.modeButton;
      demo.dataset.mode = mode;
      for (const option of demo.querySelectorAll("[data-mode-button]")) option.setAttribute("aria-pressed", String(option === button));
      $("#sensor-explanation").textContent = explanations[modes.indexOf(mode)];
      $(".scene-label").textContent = mode === "fusion" ? "RGB + IR" : button.textContent;
      mix.disabled = mode !== "fusion";
      demo.querySelector(".mix-setting").classList.toggle("inactive", mode !== "fusion");
    });
  $("#scene-condition").addEventListener("change", (event) => {
    demo.dataset.condition = event.target.value;
  });
  mix.addEventListener("input", () => {
    demo.style.setProperty("--ir-mix", Number(mix.value) / 100);
    $("#mix-value").value = `${mix.value} %`;
  });
  $("#show-annotations").addEventListener("change", (event) => {
    demo.classList.toggle("annotations-off", !event.target.checked);
  });
}
