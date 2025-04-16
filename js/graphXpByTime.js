export function graphXpByTime(data) {
  const svgWidth = 600;
  const svgHeight = 300;
  const padding = 50;

  const sortedData = [...data].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const dates = sortedData.map(d => new Date(d.createdAt).getTime());
  const amounts = sortedData.map(d => d.amount);

  const minDate = Math.min(...dates);
  const maxDate = Math.max(...dates);
  const maxAmount = Math.max(...amounts) * 1.1;

  const points = generateGraphPoints(sortedData, { svgWidth, svgHeight, padding, minDate, maxDate, maxAmount });
  const polylinePoints = points.map(p => `${p.x},${p.y}`).join(" ");

  const svg = `
    <svg viewBox="0 0 ${svgWidth} ${svgHeight}" style="overflow: visible;">
      ${generateTitle(svgWidth)}
      ${generateAxes(svgWidth, svgHeight, padding)}
      ${generateXTicks(minDate, maxDate, svgWidth, svgHeight, padding)}
      ${generateYTicks(maxAmount, svgWidth, svgHeight, padding)}
      ${generateAxisLabels(svgWidth, svgHeight, padding)}
      <polyline points="${polylinePoints}" fill="none" stroke="#007bff" stroke-width="3" />
      ${generateDataPoints(points)}
    </svg>
  `;

  const graphContainer = document.getElementById("graph1");
  graphContainer.innerHTML = svg;
  setupTooltip(graphContainer);
}

function generateGraphPoints(data, { svgWidth, svgHeight, padding, minDate, maxDate, maxAmount }) {
  return data.map(({ createdAt, amount, object }) => {
    const x = padding + ((new Date(createdAt).getTime() - minDate) / (maxDate - minDate)) * (svgWidth - 2 * padding);
    const y = svgHeight - padding - (amount / maxAmount) * (svgHeight - 2 * padding);
    return { x, y, amount, name: object.name, date: createdAt };
  });
}

function generateTitle(svgWidth) {
  return `
    <text x="${svgWidth / 2}" y="30" text-anchor="middle" font-size="18" font-weight="bold" fill="#333">
      XP earned by Project
    </text>
  `;
}

function generateAxes(svgWidth, svgHeight, padding) {
  return `
    <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${svgHeight - padding}" stroke="#999" />
    <line x1="${padding}" y1="${svgHeight - padding}" x2="${svgWidth - padding}" y2="${svgHeight - padding}" stroke="#999" />
  `;
}

function generateAxisLabels(svgWidth, svgHeight, padding) {
  return `
    <text x="${padding}" y="${padding - 20}" fill="#444" font-size="14" text-anchor="end">XP</text>
    <text x="${svgWidth - padding}" y="${svgHeight - padding + 40}" fill="#444" font-size="14" text-anchor="middle">Date</text>
  `;
}

function generateXTicks(min, max, width, height, padding) {
  const ticks = 5;
  const step = (max - min) / ticks;
  return Array.from({ length: ticks + 1 }, (_, i) => {
    const time = new Date(min + i * step);
    const x = padding + (i / ticks) * (width - 2 * padding);
    const dateLabel = time.toISOString().split("T")[0];
    return `
      <line x1="${x}" y1="${height - padding}" x2="${x}" y2="${height - padding + 5}" stroke="#666"/>
      <text x="${x}" y="${height - padding + 20}" font-size="12" fill="#333" text-anchor="middle">${dateLabel}</text>
    `;
  }).join("");
}

function generateYTicks(max, width, height, padding) {
  const ticks = 5;
  return Array.from({ length: ticks + 1 }, (_, i) => {
    const value = Math.round((max / ticks) * i);
    const y = height - padding - (i / ticks) * (height - 2 * padding);
    return `
      <line x1="${padding - 5}" y1="${y}" x2="${padding}" y2="${y}" stroke="#666"/>
      <text x="${padding - 10}" y="${y + 5}" font-size="12" fill="#333" text-anchor="end">${value}</text>
    `;
  }).join("");
}

function generateDataPoints(points) {
  return points.map(({ x, y, amount, name, date }) => `
    <circle cx="${x}" cy="${y}" r="5" fill="#007bff" class="data-point"
      data-amount="${amount}" data-name="${name}" data-date="${date}" />
  `).join("");
}

function setupTooltip(container) {
  let tooltip = document.getElementById("tooltip");
  if (!tooltip) {
    tooltip = document.createElement("div");
    tooltip.id = "tooltip";
    tooltip.style.cssText = `
      position: absolute;
      padding: 8px 12px;
      background: rgba(0, 0, 0, 0.75);
      color: white;
      border-radius: 6px;
      font-size: 14px;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s;
      z-index: 1000;
    `;
    document.body.appendChild(tooltip);
  }

  const svgElem = container.querySelector("svg");

  svgElem.addEventListener("mousemove", e => {
    const target = e.target;
    if (target.classList.contains("data-point")) {
      const amount = target.getAttribute("data-amount");
      const name = target.getAttribute("data-name");
      const date = new Date(target.getAttribute("data-date"));

      tooltip.innerHTML = `
        <strong>${name}</strong><br>
        XP: ${amount}<br>
        <span style="font-size: 12px;">Achieved on: ${date.toLocaleDateString()}</span>
      `;
      tooltip.style.left = `${e.pageX + 10}px`;
      tooltip.style.top = `${e.pageY - 40}px`;
      tooltip.style.opacity = 1;
    } else {
      tooltip.style.opacity = 0;
    }
  });

  svgElem.addEventListener("mouseleave", () => {
    tooltip.style.opacity = 0;
  });
}
