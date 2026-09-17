/* ============================================================
   ACADEMIC BACKGROUND
============================================================ */


/* ============================================================
   BUBBLE GENERATION
============================================================ */

const bubbleContainer =
    document.querySelector(
        "#bubble-container"
    );


if (bubbleContainer) {

    const bubbleCount = 24;


    for (
        let i = 0;
        i < bubbleCount;
        i++
    ) {

        const bubble =
            document.createElement(
                "div"
            );


        bubble.classList.add(
            "bubble"
        );


        /* ----------------------------------------------------
           SIZE
        ---------------------------------------------------- */

        const size =
            5 + Math.random() * 13;


        bubble.style.width =
            `${size}px`;


        bubble.style.height =
            `${size}px`;


        /* ----------------------------------------------------
           HORIZONTAL START
        ---------------------------------------------------- */

        bubble.style.left =
            `${Math.random() * 100}%`;


        /* ----------------------------------------------------
           HORIZONTAL DRIFT
        ---------------------------------------------------- */

        const driftA =
            -30 + Math.random() * 60;

        const driftB =
            -60 + Math.random() * 120;

        const driftC =
            -50 + Math.random() * 100;

        const driftD =
            -80 + Math.random() * 160;


        bubble.style.setProperty(
            "--drift-a",
            `${driftA}px`
        );

        bubble.style.setProperty(
            "--drift-b",
            `${driftB}px`
        );

        bubble.style.setProperty(
            "--drift-c",
            `${driftC}px`
        );

        bubble.style.setProperty(
            "--drift-d",
            `${driftD}px`
        );


        /* ----------------------------------------------------
           SPEED
           
           Each bubble rises at a slightly
           different speed.
        ---------------------------------------------------- */

        const duration =
            8 + Math.random() * 10;


        bubble.style.setProperty(
            "--bubble-duration",
            `${duration}s`
        );


        /* ----------------------------------------------------
           OPACITY
        ---------------------------------------------------- */

        const opacity =
            0.25 + Math.random() * 0.35;


        bubble.style.setProperty(
            "--bubble-opacity",
            opacity
        );


        /* ----------------------------------------------------
           RANDOM STARTING PHASE
           
           Negative delay means the page doesn't
           start with all bubbles appearing at once.
        ---------------------------------------------------- */

        const delay =
            -(Math.random() * duration);


        bubble.style.setProperty(
            "--bubble-delay",
            `${delay}s`
        );


        bubbleContainer.appendChild(
            bubble
        );

    }

}


/* ============================================================
   KELP DRAW
============================================================ */

const kelpParts =
    document.querySelectorAll(
        ".kelp-stem, .kelp-leaf"
    );


kelpParts.forEach(
    (part, index) => {

        if (
            part.classList.contains(
                "kelp-stem"
            )
        ) {

            const length =
                part.getTotalLength();


            part.style.strokeDasharray =
                length;


            part.style.strokeDashoffset =
                length;


            part.style.transition =
                "stroke-dashoffset 2.2s ease";


            requestAnimationFrame(
                () => {

                    part.style.strokeDashoffset =
                        0;

                }
            );

        } else {

            part.style.opacity =
                "0";


            part.style.transformOrigin =
                "center";


            part.style.transition =
                `opacity 700ms ease ${700 + index * 100}ms`;


            requestAnimationFrame(
                () => {

                    part.style.opacity =
                        "0.95";

                }
            );

        }

    }
);


/* ============================================================
   EVENT REVEAL
============================================================ */

const events =
    document.querySelectorAll(
        ".academic-event"
    );


events.forEach(
    (event, index) => {

        /*
           Only animate opacity.

           Do NOT animate transform here because
           transform is needed by the CSS hover effect.
        */

        event.animate(
            [
                {
                    opacity: 0
                },

                {
                    opacity: 1
                }
            ],

            {
                duration: 700,

                delay:
                    700 + index * 300,

                easing:
                    "ease-out",

                fill:
                    "both"
            }
        );

    }
);