/* ============================================================
PORTFOLIO TOPOLOGY
============================================================ */
const SVG_WIDTH = 1600;
const SVG_HEIGHT = 1000;
const CENTER = {
x: 800,
y: 500
};
/* ============================================================
NODE POSITIONS
============================================================ */
const nodes = {
satellite: {
    x: 800,
    y: 110,
    label: "VISION"
},
submarine: {
    x: 800,
    y: 890,
    label: "ACADEMIC BACKGROUND"
},
boat: {
    x: 1137.64,
    y: 695,
    label: "OUTREACH & COMMUNITY"
},
terrain: {
    x: 462.36,
    y: 695,
    label: "TECH STACK"
},
uav: {
    x: 462.36,
    y: 305,
    label: "PROJECTS & RESEARCHES"
},
aircraft: {
    x: 1137.64,
    y: 305,
    label: "IMPACT"
}
};
/* ============================================================
SVG REFERENCES
============================================================ */
const svg = document.getElementById(
"topology"
);
const pcbTraces = document.getElementById(
"pcb-traces"
);
const vias = document.getElementById(
"vias"
);
const controlCore = document.getElementById(
"control-core"
);
const floor = document.getElementById(
"floor"
);
const redstoneBackground = document.getElementById(
"redstone-background"
);
const nodeOverlay = document.getElementById(
"node-overlay"
);
/* ============================================================
HELPER
============================================================ */
function createSVGElement(
tag,
attributes = {}
) {
const element =
    document.createElementNS(
        "http://www.w3.org/2000/svg",
        tag
    );
Object.entries(
    attributes
).forEach(
    ([key, value]) => {
        element.setAttribute(
            key,
            value
        );
    }
);
return element;
}
/* ============================================================
FLOOR
============================================================ */
function createFloor() {
const tileSize = 80;
for (
    let y = 0;
    y < SVG_HEIGHT;
    y += tileSize
) {
    for (
        let x = 0;
        x < SVG_WIDTH;
        x += tileSize
    ) {
        const tile =
            createSVGElement(
                "rect",
                {
                    x,
                    y,
                    width: tileSize,
                    height: tileSize,
                    class: "stone-tile"
                }
            );
        floor.appendChild(tile);
    }
}
}
/* ============================================================
ORTHOGONAL PATH
============================================================ */
function createOrthogonalPath(
start,
end
) {
const middleX =
    start.x +
    (end.x - start.x) * 0.5;
return `
    M ${start.x} ${start.y}
    L ${middleX} ${start.y}
    L ${middleX} ${end.y}
    L ${end.x} ${end.y}
`;
}
/* ============================================================
VIA
============================================================ */
function addVia(
x,
y
) {
const group =
    createSVGElement(
        "g"
    );
const outer =
    createSVGElement(
        "circle",
        {
            cx: x,
            cy: y,
            r: 8,
            class: "pcb-via-outer"
        }
    );
const inner =
    createSVGElement(
        "circle",
        {
            cx: x,
            cy: y,
            r: 3,
            class: "pcb-via-inner"
        }
    );
group.appendChild(
    outer
);
group.appendChild(
    inner
);
vias.appendChild(
    group
);
}
/* ============================================================
TRACE
============================================================ */
function createTrace(
nodeName,
node
) {
const pathData =
    createOrthogonalPath(
        CENTER,
        node
    );
const base =
    createSVGElement(
        "path",
        {
            d: pathData,
            class: "pcb-trace-base"
        }
    );
const trace =
    createSVGElement(
        "path",
        {
            d: pathData,
            class: "pcb-trace",
            "data-node": nodeName
        }
    );
pcbTraces.appendChild(
    base
);
pcbTraces.appendChild(
    trace
);
}
/* ============================================================
NODE
============================================================ */
function createNode(
nodeName,
node
) {
const container =
    document.createElement(
        "div"
    );
container.className =
    "html-node";
container.dataset.node =
    nodeName;
const hex =
    document.createElement(
        "div"
    );
hex.className =
    "html-node-hex";
const label =
    document.createElement(
        "div"
    );
label.className =
    "html-node-label";
label.textContent =
    node.label;
const led =
    document.createElement(
        "div"
    );
led.className =
    "html-node-led";
hex.appendChild(
    label
);
container.appendChild(
    hex
);
container.appendChild(
    led
);
container.addEventListener(
    "mouseenter",
    () => {
        highlightTrace(
            nodeName
        );
    }
);
container.addEventListener(
    "mouseleave",
    () => {
        clearTraceHighlight(
            nodeName
        );
    }
);
container.addEventListener(
    "click",
    () => {
        activateNode(
            nodeName
        );
    }
);
nodeOverlay.appendChild(
    container
);
}
/* ============================================================
NODE POSITION UPDATE
============================================================ */
/* ============================================================
NODE POSITION UPDATE
============================================================ */
function updateNodePositions() {
const rect =
    svg.getBoundingClientRect();

const scaleX =
    rect.width /
    SVG_WIDTH;

const scaleY =
    rect.height /
    SVG_HEIGHT;

const scale =
    Math.min(
        scaleX,
        scaleY
    );

const renderedWidth =
    SVG_WIDTH *
    scale;

const renderedHeight =
    SVG_HEIGHT *
    scale;

const offsetX =
    (rect.width -
    renderedWidth) / 2;

const offsetY =
    (rect.height -
    renderedHeight) / 2;

Object.entries(
    nodes
).forEach(
    ([nodeName, node]) => {

        const element =
            nodeOverlay.querySelector(
                `[data-node="${nodeName}"]`
            );

        if (!element) {
            return;
        }

        const x =
            offsetX +
            node.x * scale;

        const y =
            offsetY +
            node.y * scale;

        element.style.left =
            `${x}px`;

        element.style.top =
            `${y}px`;

        element.style.transform =
            `
            translate(-50%, -50%)
            scale(${scale})
            `;
    }
);
}
/* ============================================================
TRACE HIGHLIGHT
============================================================ */
function highlightTrace(
nodeName
) {
const trace =
    pcbTraces.querySelector(
        `.pcb-trace[data-node="${nodeName}"]`
    );
if (!trace) {
    return;
}
trace.classList.add(
    "hovered"
);
}
/* ============================================================
CLEAR TRACE HIGHLIGHT
============================================================ */
function clearTraceHighlight(
nodeName
) {
const trace =
    pcbTraces.querySelector(
        `.pcb-trace[data-node="${nodeName}"]`
    );
if (!trace) {
    return;
}
trace.classList.remove(
    "hovered"
);
}
/* ============================================================
ACTIVATE NODE
============================================================ */
function activateNode(
nodeName
) {
document
    .querySelectorAll(
        ".html-node"
    )
    .forEach(
        element => {
            element.classList.remove(
                "active"
            );
        }
    );
const node =
    nodeOverlay.querySelector(
        `[data-node="${nodeName}"]`
    );
if (node) {
    node.classList.add(
        "active"
    );
}
controlCore.classList.remove(
    "core-selected"
);
}
/* ============================================================
CORE
============================================================ */
function createCore() {
const group =
    createSVGElement(
        "g",
        {
            class: "clickable-core"
        }
    );
const outer =
    createSVGElement(
        "polygon",
        {
            points: `
                800,380
                904,440
                904,560
                800,620
                696,560
                696,440
            `,
            class: "core-hex"
        }
    );
const inner =
    createSVGElement(
        "polygon",
        {
            points: `
                800,395
                891,447
                891,553
                800,605
                709,553
                709,447
            `,
            class: "core-inner-hex"
        }
    );
const status =
    createSVGElement(
        "text",
        {
            x: 800,
            y: 460,
            class: "core-status"
        }
    );
status.textContent =
    "ABOUT";
const name =
    createSVGElement(
        "text",
        {
            x: 800,
            y: 510,
            class: "core-name"
        }
    );
name.textContent =
    "Mahasin";
const divider =
    createSVGElement(
        "line",
        {
            x1: 735,
            y1: 530,
            x2: 865,
            y2: 530,
            class: "core-divider"
        }
    );
const description =
    createSVGElement(
        "text",
        {
            x: 800,
            y: 558,
            class: "core-description"
        }
    );
description.textContent =
    "Portfolio";
group.appendChild(
    outer
);
group.appendChild(
    inner
);
group.appendChild(
    status
);
group.appendChild(
    name
);
group.appendChild(
    divider
);
group.appendChild(
    description
);
group.addEventListener(
    "mouseenter",
    () => {
        group.classList.add(
            "core-hover"
        );
    }
);
group.addEventListener(
    "mouseleave",
    () => {
        group.classList.remove(
            "core-hover"
        );
    }
);
group.addEventListener(
    "click",
    () => {
        window.location.href = "about.html";
    }
);
controlCore.appendChild(
    group
);
}
/* ============================================================
BUILD
============================================================ */
createFloor();
Object.entries(
nodes
).forEach(
([nodeName, data]) => {
    createTrace(
        nodeName,
        data
    );
    createNode(
        nodeName,
        data
    );
}
);
createCore();
updateNodePositions();
/* ============================================================
RESIZE
============================================================ */
window.addEventListener(
"resize",
updateNodePositions
);
if (
"ResizeObserver" in window
) {
const observer =
    new ResizeObserver(
        updateNodePositions
    );
observer.observe(
    document.getElementById(
        "topology-world"
    )
);
}
