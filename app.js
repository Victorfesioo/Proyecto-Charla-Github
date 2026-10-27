const events = [
  {
    day: 3,
    category: "Meetup",
    categoryLabel: "MEETUP",
    title: "Málaga AI Builders: de idea a prototipo",
    venue: "La Térmica",
    time: "18:30",
    capacity: "12 plazas",
    color: "lime",
    description: "Una tarde para crear con IA, compartir experimentos y conocer a la comunidad local.",
  },
  {
    day: 6,
    category: "Taller",
    categoryLabel: "TALLER",
    title: "Diseña tu primera app con código abierto",
    venue: "Google for Startups",
    time: "17:00",
    capacity: "6 plazas",
    color: "coral",
    description: "Taller práctico de desarrollo web para dar forma a una idea desde cero.",
  },
  {
    day: 12,
    category: "Charla",
    categoryLabel: "CHARLA",
    title: "El futuro del diseño digital es colaborativo",
    venue: "Innovation Campus",
    time: "19:00",
    capacity: "Aforo libre",
    color: "blue",
    description: "Diseño, producto y tecnología: tres miradas sobre lo que viene después.",
  },
  {
    day: 18,
    category: "Meetup",
    categoryLabel: "MEETUP",
    title: "Frontend Sur: interfaces con superpoderes",
    venue: "The Living Room",
    time: "18:00",
    capacity: "9 plazas",
    color: "lime",
    description: "Demos, tips de frontend y charlas breves en un encuentro sin slides eternas.",
  },
  {
    day: 21,
    category: "Taller",
    categoryLabel: "TALLER",
    title: "Hackea tus datos: visualización creativa",
    venue: "Málaga TechPark",
    time: "10:30",
    capacity: "4 plazas",
    color: "coral",
    description: "Convierte datos abiertos en historias visuales en este taller de sábado.",
  },
  {
    day: 26,
    category: "Charla",
    categoryLabel: "CHARLA",
    title: "Ciberseguridad sin capa (pero con criterio)",
    venue: "FYCMA · Foro Tech",
    time: "18:30",
    capacity: "Aforo libre",
    color: "blue",
    description: "Buenas prácticas, amenazas reales y seguridad digital explicada sin dramas.",
  },
];

const monthNames = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];
const weekDays = ["L", "M", "X", "J", "V", "S", "D"];
const eventList = document.querySelector("#event-list");
const emptyState = document.querySelector("#empty-state");
const searchInput = document.querySelector("#event-search");
const monthHeading = document.querySelector("#calendar-month");
const calendarGrid = document.querySelector("#calendar-grid");
const loadMoreButton = document.querySelector("#load-more");
let activeFilter = "Todos";
let selectedDay = null;
let visibleMonth = new Date(2026, 10, 1);

function renderEvents() {
  const query = searchInput.value.trim().toLocaleLowerCase("es");
  const filteredEvents = events.filter((event) => {
    const matchesCategory = activeFilter === "Todos" || event.category === activeFilter;
    const searchableText = `${event.title} ${event.venue} ${event.category} ${event.description}`.toLocaleLowerCase("es");
    const matchesQuery = searchableText.includes(query);
    const matchesMonth = visibleMonth.getFullYear() === 2026 && visibleMonth.getMonth() === 10;
    const matchesDay = selectedDay === null
      || (matchesMonth && event.day === selectedDay);
    return matchesCategory && matchesQuery && matchesMonth && matchesDay;
  });

  eventList.innerHTML = filteredEvents.map((event) => `
    <a class="event-card" href="mailto:hola@pixelmalaga.dev?subject=${encodeURIComponent(`Me interesa: ${event.title}`)}&body=${encodeURIComponent(event.description)}" aria-label="${event.title}, ${event.day} de noviembre a las ${event.time}, en ${event.venue}">
      <div class="date-block"><strong>${String(event.day).padStart(2, "0")}</strong><span>NOV</span></div>
      <div class="event-main">
        <div class="event-meta"><span class="event-kind ${event.color}">${event.categoryLabel}</span><span class="meta-dot"></span><span>${event.time}</span></div>
        <h3>${event.title}</h3>
        <div class="event-detail">
          <span><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M13 6.7c0 3.6-5 7.4-5 7.4S3 10.3 3 6.7a5 5 0 1 1 10 0Z"/><circle cx="8" cy="6.5" r="1.5"/></svg>${event.venue}</span>
          <span><svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="5.5"/><path d="M8 4.5V8l2.4 1.5"/></svg>${event.capacity}</span>
        </div>
      </div>
      <div class="event-action"><span class="event-capacity"><b>●</b> ${event.capacity}</span><span class="event-arrow" aria-hidden="true">↗</span></div>
    </a>
  `).join("");

  emptyState.hidden = filteredEvents.length > 0;
  loadMoreButton.hidden = filteredEvents.length === 0;
}

function renderCalendar() {
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPreviousMonth = new Date(year, month, 0).getDate();
  const mondayFirstOffset = (firstDay.getDay() + 6) % 7;
  const gridCellCount = Math.ceil((mondayFirstOffset + daysInMonth) / 7) * 7;

  monthHeading.innerHTML = `${monthNames[month]} <span>${year}</span>`;
  calendarGrid.innerHTML = weekDays.map((day) => `<span class="calendar-weekday" aria-hidden="true">${day}</span>`).join("");

  for (let cell = 0; cell < gridCellCount; cell += 1) {
    const dayNumber = cell - mondayFirstOffset + 1;
    const isOutside = dayNumber < 1 || dayNumber > daysInMonth;
    const day = dayNumber < 1
      ? daysInPreviousMonth + dayNumber
      : dayNumber > daysInMonth ? dayNumber - daysInMonth : dayNumber;
    const isEventDay = year === 2026 && month === 10 && events.some((event) => event.day === day);
    const today = new Date();
    const isToday = year === today.getFullYear() && month === today.getMonth() && day === today.getDate() && !isOutside;
    const isSelected = selectedDay === day && !isOutside;
    const button = document.createElement("button");
    button.type = "button";
    button.className = [
      "calendar-day",
      isOutside ? "outside" : "",
      isEventDay && !isOutside ? "has-event" : "",
      isToday ? "today" : "",
      isSelected ? "selected" : "",
    ].filter(Boolean).join(" ");
    button.textContent = day;
    button.setAttribute("aria-label", `${day} de ${monthNames[(month + (dayNumber < 1 ? 11 : dayNumber > daysInMonth ? 1 : 0) + 12) % 12]}${isEventDay && !isOutside ? ", hay evento" : ""}`);
    if (isOutside) {
      button.disabled = true;
      button.tabIndex = -1;
    } else {
      button.setAttribute("aria-pressed", String(isSelected));
      if (isToday) button.setAttribute("aria-current", "date");
      button.addEventListener("click", () => {
        selectedDay = selectedDay === day ? null : day;
        renderCalendar();
        renderEvents();
      });
    }
    calendarGrid.append(button);
  }
}

document.querySelectorAll(".filter-tab").forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    document.querySelector(".filter-tab.active")?.classList.remove("active");
    button.classList.add("active");
    renderEvents();
  });
});

searchInput.addEventListener("input", renderEvents);
document.querySelector("#prev-month").addEventListener("click", () => {
  visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1);
  selectedDay = null;
  renderCalendar();
  renderEvents();
});
document.querySelector("#next-month").addEventListener("click", () => {
  visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1);
  selectedDay = null;
  renderCalendar();
  renderEvents();
});
document.querySelector("#theme-toggle").addEventListener("click", (event) => {
  const root = document.documentElement;
  const nextTheme = root.dataset.theme === "light" ? "dark" : "light";
  root.dataset.theme = nextTheme;
  localStorage.setItem("pixel-theme", nextTheme);
  event.currentTarget.setAttribute("aria-label", `Cambiar a modo ${nextTheme === "light" ? "oscuro" : "claro"}`);
  document.querySelector('meta[name="theme-color"]').content = nextTheme === "light" ? "#f4f3ec" : "#10120f";
});
loadMoreButton.addEventListener("click", () => {
  activeFilter = "Todos";
  selectedDay = null;
  visibleMonth = new Date(2026, 10, 1);
  searchInput.value = "";
  document.querySelector(".filter-tab.active")?.classList.remove("active");
  document.querySelector('[data-filter="Todos"]').classList.add("active");
  renderCalendar();
  renderEvents();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "/" && document.activeElement !== searchInput && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
    event.preventDefault();
    searchInput.focus();
  }
  if (event.key === "Escape" && document.activeElement === searchInput) {
    searchInput.value = "";
    searchInput.blur();
    renderEvents();
  }
});

const savedTheme = localStorage.getItem("pixel-theme");
if (savedTheme === "light" || savedTheme === "dark") document.documentElement.dataset.theme = savedTheme;
document.querySelector("#theme-toggle").setAttribute("aria-label", `Cambiar a modo ${savedTheme === "light" ? "oscuro" : "claro"}`);
document.querySelector('meta[name="theme-color"]').content = savedTheme === "light" ? "#f4f3ec" : "#10120f";
renderCalendar();
renderEvents();
