import { getCookie, logoutButton } from "./login.js"
import { transactionTableByUserId, fetchUserInfo, xpUser, userXPLevel, fetchUserAudit } from "./request.js";
import { graphProjectXpByTime, xpByTime } from "./ProjectXpByTime.js";
import { DisplayAuditRatio, DisplayAuditValidator, DisplayUserInfos, DisplayXp } from "./userInfos.js";


export async function homePage(){
    document.body.innerHTML = ''

    let token = getCookie('authToken');
    
    let user_info = await fetchUserInfo(token);
    let id_user = user_info.id;
    
    let data_transaction = transactionTableByUserId(token, id_user);
    createLayout();
    
    
    data_transaction.then(function(result){
        //console.log(result)
        graphProjectXpByTime(result);
        xpByTime(result)
    })

    
    DisplayUserInfos(user_info)
    let lvl = await userXPLevel(token, user_info.login)
    
    let xp = xpUser(token)
    xp.then(function(result){
        //console.log(result)
        DisplayXp(result, lvl)
    })
    
    DisplayAuditRatio(user_info)
    
    let audit_res = await fetchUserAudit(token, user_info.login)
    DisplayAuditValidator(audit_res)

    logoutButton()
}


function createLayout() {

    const container = document.createElement("div");
    container.id = "container";
    container.style.display = "flex"; // Flex layout for left/right sections
    container.style.height = "100vh"; // Full viewport height

    // Create left box for personal data
    const leftBox = document.createElement("div");
    leftBox.id = "left-box";
    leftBox.style.flex = "1"; // Adjust as needed
    leftBox.style.padding = "20px";
    leftBox.style.overflowY = "auto";
    leftBox.style.borderRight = "1px solid #ddd";
    leftBox.style.maxWidth = "300px"; // Optional: control width
    leftBox.style.boxSizing = "border-box";

    // Right section with two graph boxes
    const rightSection = document.createElement("div");
    rightSection.id = "right-section";
    rightSection.style.flex = "3";
    rightSection.style.padding = "20px";
    rightSection.style.display = "flex";
    rightSection.style.flexDirection = "column";
    rightSection.style.gap = "20px";
    rightSection.style.overflowY = "auto"; // Optional if you want right to scroll too

    // First graph box
    const graph1 = document.createElement("div");
    graph1.id = "graph1";
    graph1.className = "graph-box";
    const svg1 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg1.setAttribute("width", "150");
    svg1.setAttribute("height", "150");
    svg1.innerHTML = `<rect x="10" y="10" width="100" height="100" fill="lightblue" />`;
    graph1.appendChild(svg1);

    // Second graph box
    const graph2 = document.createElement("div");
    graph2.id = "graph2";
    graph2.className = "graph-box";
    const svg2 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg2.setAttribute("width", "150");
    svg2.setAttribute("height", "150");
    svg2.innerHTML = `<circle cx="60" cy="60" r="50" fill="lightgreen" />`;
    graph2.appendChild(svg2);

    // Append graph boxes
    rightSection.appendChild(graph1);
    rightSection.appendChild(graph2);

    // Append both sections to container
    container.appendChild(leftBox);
    container.appendChild(rightSection);

    document.body.innerHTML = "";
    document.body.appendChild(container);
}
