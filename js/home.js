import { getCookie } from "./login.js"
import { transactionTableByUserId, fetchUserInfo } from "../request.js";
import { graphXpByTime } from "./graphXpByTime.js";


export async function homePage(){
    document.body.innerHTML = ''


    let token = getCookie('authToken');
    
    let user_info = await fetchUserInfo(token);
    let id_user = user_info.id;
    
    let data_transaction = transactionTableByUserId(token, id_user);
    createLayout();

    data_transaction.then(function(result){
        console.log(result)
        graphXpByTime(result);
    })
    
}


function createLayout() {

    const container = document.createElement("div");
    container.id = "container"

    // Create left box for personal data
    const leftBox = document.createElement("div");
    leftBox.id = "left-box";
    leftBox.innerHTML = "<h3>User Info</h3><p>Name: </p><p>Email: </p>"; // example content

    // Right section with two graph boxes
    const rightSection = document.createElement("div");
    rightSection.id = "right-section";

    // First graph box
    const graph1 = document.createElement("div");
    graph1.id = "graph1"
    graph1.className = "graph-box";
    const svg1 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg1.innerHTML = `<rect x="10" y="10" width="100" height="100" fill="lightblue" />`; // Example SVG content
    graph1.appendChild(svg1);

    // Second graph box
    const graph2 = document.createElement("div");
    graph2.className = "graph-box";
    const svg2 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg2.innerHTML = `<circle cx="60" cy="60" r="50" fill="lightgreen" />`; // Example SVG content
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