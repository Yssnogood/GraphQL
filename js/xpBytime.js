export function xpByTime(data) {
    const svgWidth = 600;
    const svgHeight = 300;
    const padding = 50;
  
    // Sort by date
    const sortedData = [...data].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  
    // Accumulate XP over time
    let accumulatedXP = 0;
    const cumulativeData = sortedData.map(d => {
      accumulatedXP += d.amount;
      return {
        createdAt: d.createdAt,
        amount: accumulatedXP,
        name: d.object?.name || 'Unknown',
      };
    });
  
    const dates = cumulativeData.map(d => new Date(d.createdAt).getTime());
    const amounts = cumulativeData.map(d => d.amount);
  
    const minDate = Math.min(...dates);
    const maxDate = Math.max(...dates);
    const maxAmount = Math.max(...amounts) * 1.1;
  
    const points = generateGraphPoints(cumulativeData, { svgWidth, svgHeight, padding, minDate, maxDate, maxAmount });
    const polylinePoints = points.map(p => `${p.x},${p.y}`).join(" ");
  
    const svg = `
      <svg viewBox="0 0 ${svgWidth} ${svgHeight}" style="overflow: visible;">
        ${generateTitle(svgWidth, "Total XP Over Time")}
        ${generateAxes(svgWidth, svgHeight, padding)}
        ${generateXTicks(minDate, maxDate, svgWidth, svgHeight, padding)}
        ${generateYTicks(maxAmount, svgWidth, svgHeight, padding)}
        ${generateAxisLabels(svgWidth, svgHeight, padding)}
        <polyline points="${polylinePoints}" fill="none" stroke="#28a745" stroke-width="3" />
        ${generateDataPoints(points)}
      </svg>
    `;
  
    const graphContainer = document.getElementById("graph2");
    graphContainer.innerHTML = svg;
    setupTooltip(graphContainer);
  }
  
  // Slightly tweaked title generator to allow reuse
  function generateTitle(svgWidth, title = "XP earned by Project") {
    return `
      <text x="${svgWidth / 2}" y="30" text-anchor="middle" font-size="18" font-weight="bold" fill="#333">
        ${title}
      </text>
    `;
  }
  