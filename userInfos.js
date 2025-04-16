
export function DisplayUserInfos(data) {
    const profil = document.getElementById("left-box");
  
    // Clear previous content if needed
    const existing = document.getElementById("info-display");
    if (existing) existing.remove();
  
    const info_display = document.createElement("div");
    info_display.id = "info-display";
  
    info_display.innerHTML = `
      <h3>User Information</h3>
      <p><strong>Id:</strong> ${data.id}</p>
      <p><strong>Username:</strong> ${data.login}</p>
      <p><strong>First Name:</strong> ${data.attrs.firstName}</p>
      <p><strong>Last Name:</strong> ${data.attrs.lastName}</p>
      <p><strong>Country:</strong> ${data.attrs.country}</p>
      <p><strong>Email:</strong> ${data.attrs.email}</p>
      <p><strong>Situation:</strong> ${data.attrs.Situation || "N/A"}</p>
    `;
  
    // Optional: Add some quick styling
    info_display.style.padding = "10px";
    info_display.style.border = "1px solid #ddd";
    info_display.style.borderRadius = "8px";
    info_display.style.backgroundColor = "#f9f9f9";
    info_display.style.marginBottom = "20px";
    info_display.style.fontSize = "14px";
  
    profil.appendChild(info_display);

}

export function DisplayAuditRatio(data) {
    const profil = document.getElementById("left-box");
  
    // Clear previous instance if needed
    const existing = document.getElementById("audit_ratio");
    if (existing) existing.remove();
  
    const audit_ratio = document.createElement("div");
    audit_ratio.id = "audit_ratio";
  
    const done = data.totalUp;
    const received = data.totalDown;
    const maxValue = Math.max(done, received, 1); // avoid div by 0
  
    audit_ratio.innerHTML = `
      <div style="margin-bottom: 10px;">
        <h3 style="margin-bottom: 5px;">Audit Stats</h3>
        <p><strong>Audit Ratio:</strong> ${data.auditRatio.toFixed(2)}</p>
      </div>
  
      <div style="margin-bottom: 10px;">
        <p><strong>Done (${done})</strong></p>
        <div style="background: #eee; border-radius: 5px; height: 20px; width: 100%;">
          <div style="height: 100%; width: ${(done / maxValue) * 100}%; background-color: #28a745; border-radius: 5px;"></div>
        </div>
      </div>
  
      <div>
        <p><strong>Received (${received})</strong></p>
        <div style="background: #eee; border-radius: 5px; height: 20px; width: 100%;">
          <div style="height: 100%; width: ${(received / maxValue) * 100}%; background-color: #dc3545; border-radius: 5px;"></div>
        </div>
      </div>
    `;
  
    audit_ratio.style.padding = "10px";
    audit_ratio.style.border = "1px solid #ddd";
    audit_ratio.style.borderRadius = "8px";
    audit_ratio.style.backgroundColor = "#f9f9f9";
    audit_ratio.style.marginBottom = "20px";
    audit_ratio.style.fontSize = "14px";
  
    profil.appendChild(audit_ratio);
  }
  
export function DisplayXp(xp){
    const profil = document.getElementById("left-box");

        // Clear previous instance if needed
    const existing = document.getElementById("audit_ratio");
    if (existing) existing.remove();

    const audit_ratio = document.createElement("div");
    audit_ratio.id = "audit_ratio";

}
