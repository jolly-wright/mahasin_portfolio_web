/* ============================================================
MAHASIN PORTFOLIO — TOPOLOGY CONTROLLER
SVG:
- background
- floor
- redstone
- PCB traces
- vias
- outer hex
- moving beam
- control core
HTML:
- six topology hexagons
- node text
- node LEDs
============================================================ */
/* ============================================================
GLOBAL SVG COORDINATE SYSTEM
============================================================ */
const SVG_WIDTH = 1600;
const SVG_HEIGHT = 1000;
/* ============================================================
CONTROL CORE
============================================================ */
const CENTER = {
x: 800,
y: 500
};
/* ============================================================
MASTER NODE POSITIONS
These are the ONLY node positions.
Six vertices = complete outer hexagon.
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
const svg =
document.getElementById("topology");
const traceLayer =
document.getElementById("pcb-traces");
const viaLayer =
document.getElementById("vias");
const coreLayer =
document.getElementById("control-core");
const floorLayer =
document.getElementById("floor");
const backgroundLayer =
document.getElementById("redstone-background");
const nodeOverlay =
document.getElementById("node-overlay");
/* ============================================================
SVG ELEMENT CREATOR
============================================================ */
function createSVGElement(
type,
attributes = {}
) {
const element =
    document.createElementNS(
        "http://www.w3.org/2000/svg",
        type
    );
for (
    const [key, value]
    of Object.entries(attributes)
) {
    element.setAttribute(
        key,
        value
    );
}
return element;
}
/* ============================================================
FLOOR
============================================================ */
function createFloor() {
const tileWidth = 160;
const tileHeight = 80;
for (
    let row = 0;
    row < Math.ceil(
        SVG_HEIGHT / tileHeight
    );
    row++
) {
    for (
        let col = -1;
        col <
        Math.ceil(
            SVG_WIDTH / tileWidth
        ) + 1;
        col++
    ) {
        const offset =
            row % 2 === 0
                ? 0
                : tileWidth / 2;
        const x =
            col * tileWidth +
            offset;
        const y =
            row * tileHeight;
        const tile =
            createSVGElement(
                "rect",
                {
                    x,
                    y,
                    width: tileWidth,
                    height: tileHeight,
                    class: "stone-tile"
                }
            );
        floorLayer.appendChild(
            tile
        );
        const crack =
            createSVGElement(
                "path",
                {
                    d: `
                        M ${x + 25} ${y + 20}
                        L ${x + 45} ${y + 30}
                        L ${x + 38} ${y + 48}
                    `,
                    class:
                        "stone-crack"
                }
            );
        floorLayer.appendChild(
            crack
        );
    }
}
}
/* ============================================================
ORTHOGONAL PCB ROUTE
============================================================ */
function createOrthogonalPath(
start,
end
) {
const dx =
    end.x - start.x;
const dy =
    end.y - start.y;
if (
    Math.abs(dx) >
    Math.abs(dy)
) {
    const midX =
        start.x +
        dx * 0.55;
    return `
        M ${start.x} ${start.y}
        L ${midX} ${start.y}
        L ${midX} ${end.y}
        L ${end.x} ${end.y}
    `;
}
const midY =
    start.y +
    dy * 0.55;
return `
    M ${start.x} ${start.y}
    L ${start.x} ${midY}
    L ${end.x} ${midY}
    L ${end.x} ${end.y}
`;
}
/* ============================================================
ADD VIA
============================================================ */
function addVia(
x,
y,
nodeName
) {
const outer =
    createSVGElement(
        "circle",
        {
            cx: x,
            cy: y,
            r: 9,
            class: "pcb-via-outer",
            "data-node": nodeName
        }
    );
const inner =
    createSVGElement(
        "circle",
        {
            cx: x,
            cy: y,
            r: 3,
            class: "pcb-via-inner",
            "data-node": nodeName
        }
    );
viaLayer.appendChild(
    outer
);
viaLayer.appendChild(
    inner
);
}
/* ============================================================
CREATE TRACE
============================================================ */
function createTrace(
nodeName,
end
) {
const pathData =
    createOrthogonalPath(
        CENTER,
        end
    );
/* --------------------------------------------------------
   DARK UNDERLAY
-------------------------------------------------------- */
const base =
    createSVGElement(
        "path",
        {
            d: pathData,
            class:
                "pcb-trace-base",
            "data-node":
                nodeName
        }
    );
/* --------------------------------------------------------
   RED TRACE
-------------------------------------------------------- */
const trace =
    createSVGElement(
        "path",
        {
            d: pathData,
            class:
                "pcb-trace",
            "data-node":
                nodeName
        }
    );
traceLayer.appendChild(
    base
);

traceLayer.appendChild(
    trace
);
/* --------------------------------------------------------
   VIA POSITION
-------------------------------------------------------- */
const dx =
    end.x - CENTER.x;
const dy =
    end.y - CENTER.y;
if (
    Math.abs(dx) >
    Math.abs(dy)
) {
    const midX =
        CENTER.x +
        dx * 0.55;
    addVia(
        midX,
        CENTER.y,
        nodeName
    );
} else {
    const midY =
        CENTER.y +
        dy * 0.55;
    addVia(
        CENTER.x,
        midY,
        nodeName
    );
}
/* --------------------------------------------------------
   ENDPOINT VIA
-------------------------------------------------------- */
addVia(
    end.x,
    end.y,
    nodeName
);
}
/* ============================================================
CREATE HTML HEX NODE
============================================================ */
function createNode(
nodeName,
data
) {
const node =
    document.createElement(
        "div"
    );
node.className =
    "html-node";
node.dataset.node =
    nodeName;
node.dataset.x =
    data.x;
node.dataset.y =
    data.y;
/* --------------------------------------------------------
   HEXAGON
-------------------------------------------------------- */
const hex =
    document.createElement(
        "div"
    );
hex.className =
    "html-node-hex";
node.appendChild(
    hex
);
/* --------------------------------------------------------
   TEXT
-------------------------------------------------------- */
const label =
    document.createElement(
        "div"
    );
label.className =
    "html-node-label";
label.textContent =
    data.label;
hex.appendChild(
    label
);
/* --------------------------------------------------------
   STATUS LED
-------------------------------------------------------- */
const led =
    document.createElement(
        "div"
    );
led.className =
    "html-node-led";
hex.appendChild(
    led
);
/* --------------------------------------------------------
   HOVER
-------------------------------------------------------- */
node.addEventListener(
    "mouseenter",
    () => {
        highlightTrace(
            nodeName
        );
    }
);
node.addEventListener(
    "mouseleave",
    () => {
        clearTraceHighlight();
    }
);
/* --------------------------------------------------------
   CLICK
-------------------------------------------------------- */
node.addEventListener(
    "click",
    () => {
        activateNode(
            nodeName,
            node
        );
    }
);
nodeOverlay.appendChild(
    node
);
}
/* ============================================================
POSITION HTML NODES OVER SVG
============================================================ */
function updateNodePositions() {
const svgRect =
    svg.getBoundingClientRect();
const scaleX =
    svgRect.width /
    SVG_WIDTH;
const scaleY =
    svgRect.height /
    SVG_HEIGHT;
const scale =
    Math.min(
        scaleX,
        scaleY
    );
const renderedWidth =
    SVG_WIDTH * scale;
const renderedHeight =
    SVG_HEIGHT * scale;
const offsetX =
    (svgRect.width -
    renderedWidth) / 2;
const offsetY =
    (svgRect.height -
    renderedHeight) / 2;
const worldRect =
    nodeOverlay.getBoundingClientRect();
document
    .querySelectorAll(
        ".html-node"
    )
    .forEach(
        node => {
            const x =
                Number(
                    node.dataset.x
                );
            const y =
                Number(
                    node.dataset.y
                );
            const screenX =
                offsetX +
                x * scale;
            const screenY =
                offsetY +
                y * scale;
            node.style.left =
                `${screenX}px`;
            node.style.top =
                `${screenY}px`;
            node.style.transform =
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

    document
        .querySelectorAll(
            ".pcb-trace"
        )
        .forEach(
            element => {

                element.classList.remove(
                    "hovered"
                );

            }
        );


    document
        .querySelectorAll(
            `.pcb-trace[data-node="${nodeName}"]`
        )
        .forEach(
            element => {

                element.classList.add(
                    "hovered"
                );

            }
        );

}
/*Clear trace highlight*/
function clearTraceHighlight() {

    document
        .querySelectorAll(
            ".pcb-trace"
        )
        .forEach(
            element => {

                element.classList.remove(
                    "hovered"
                );

            }
        );

}
/* ============================================================
NODE ACTIVATION
============================================================ */
function activateNode(
nodeName,
nodeElement
) {
document
    .querySelectorAll(
        ".html-node"
    )
    .forEach(
        node => {
            node.classList.remove(
                "active"
            );
        }
    );
nodeElement.classList.add(
    "active"
);
console.log(
    `Selected topology node: ${nodeName}`
);
}
/* ============================================================
ACTIVATE CONTROL CORE
============================================================ */
function activateCore() {

    document
        .querySelectorAll(
            ".html-node"
        )
        .forEach(
            node => {

                node.classList.remove(
                    "active"
                );

            }
        );


    document
        .querySelectorAll(
            ".clickable-core"
        )
        .forEach(
            core => {

                core.classList.add(
                    "core-selected"
                );

            }
        );


    console.log(
        "Selected topology core: MAHASIN"
    );

}
/* ============================================================
CREATE CONTROL CORE
============================================================ */
function createCore() {
const group =
    createSVGElement(
        "g",
        {
            transform:
                `translate(${CENTER.x} ${CENTER.y})`,
            class:
                "core-group"
        }
    );
/* OUTER HEX */
const outer =
    createSVGElement(
        "polygon",
        {
            points: `
                0,-112
                97,-56
                97,56
                0,112
                -97,56
                -97,-56
            `,
            class:
                "core-hex"
        }
    );
group.appendChild(
    outer
);
/* INNER HEX */
const inner =
    createSVGElement(
        "polygon",
        {
            points: `
                0,-94
                81.4,-47
                81.4,47
                0,94
                -81.4,47
                -81.4,-47
            `,
            class:
                "core-inner-hex"
        }
    );
group.appendChild(
    inner
);
/* STATUS */
const status =
    createSVGElement(
        "text",
        {
            x: 0,
            y: -42,
            class: "core-status"
        }
    );
status.textContent =
    "ABOUT";
group.appendChild(
    status
);
/* NAME */
const name =
    createSVGElement(
        "text",
        {
            x: 0,
            y: 10,
            class: "core-name"
        }
    );
name.textContent =
    "Mahasin";
group.appendChild(
    name
);
/* DIVIDER */
const divider =
    createSVGElement(
        "line",
        {
            x1: -35,
            y1: 28,
            x2: 35,
            y2: 28,
            class: "core-divider"
        }
    );
group.appendChild(
    divider
);
/* DESCRIPTION */
const description =
    createSVGElement(
        "text",
        {
            x: 0,
            y: 55,
            class: "core-description"
        }
    );
description.textContent =
    "Portfolio";
group.appendChild(
    description
);
group.classList.add("clickable-core");

group.addEventListener(
    "mouseenter",
    () => {

        group.classList.add("core-hover");

    }
);

group.addEventListener(
    "mouseleave",
    () => {

        group.classList.remove("core-hover");

    }
);

group.addEventListener(
    "click",
    () => {

        activateCore();

    }
);
coreLayer.appendChild(
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
/* ============================================================
INITIAL POSITION
============================================================ */
updateNodePositions();
/* ============================================================
RESPONSIVE POSITIONING
============================================================ */
window.addEventListener(
"resize",
updateNodePositions
);
if (
typeof ResizeObserver !== "undefined"
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
