document.addEventListener("DOMContentLoaded", function () {

    const body = document.body;

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    /* 2. WELCOME MESSAGE */

    function showToast(message, icon = "✨") {

        let toast = document.querySelector(".custom-toast");

        if (!toast) {
            toast = document.createElement("div");
            toast.className = "custom-toast";

            Object.assign(toast.style, {
                position: "fixed",
                bottom: "30px",
                left: "50%",
                transform: "translate(-50%, 20px)",
                background: "rgb(75, 58, 105)",
                color: "white",
                padding: "15px 25px",
                borderRadius: "35px",
                boxShadow: "0 8px 25px rgba(0,0,0,0.18)",
                zIndex: "9999",
                fontSize: "14px",
                fontWeight: "600",
                opacity: "0",
                transition: "all 0.35s ease",
                textAlign: "center",
                maxWidth: "90%",
                pointerEvents: "none"
            });

            document.body.appendChild(toast);
        }

        toast.textContent = icon + " " + message;

        requestAnimationFrame(() => {
            toast.style.opacity = "1";
            toast.style.transform = "translate(-50%, 0)";
        });

        clearTimeout(toast.hideTimer);

        toast.hideTimer = setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transform = "translate(-50%, 20px)";
        }, 2500);
    }


    setTimeout(() => {
        showToast("Welcome to Dreamy World!", "💜");
    }, 800);


    /* 3. SCROLL REVEAL ANIMATION */

    const revealElements = document.querySelectorAll(
        ".section, .pokemon-section, .about-section, .character-card, .favorite-card"
    );

    if (!prefersReducedMotion && "IntersectionObserver" in window) {

        revealElements.forEach(element => {
            element.style.opacity = "0";
            element.style.transform = "translateY(35px)";
            element.style.transition =
                "opacity 0.8s ease, transform 0.8s ease";
        });

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.style.opacity = "1";
                        entry.target.style.transform = "translateY(0)";

                        observer.unobserve(entry.target);
                    }

                });

            },
            {
                threshold: 0.12
            }
        );

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });

    }


    /* 4. INTERACTIVE FAVOURITE HEARTS */

    const hearts = document.querySelectorAll(".heart");

    hearts.forEach(heart => {

        heart.style.cursor = "pointer";
        heart.style.userSelect = "none";

        heart.setAttribute("role", "button");
        heart.setAttribute("tabindex", "0");
        heart.setAttribute("aria-pressed", "false");
        heart.setAttribute("aria-label", "Add to favourites");

        function toggleHeart() {

            const isLiked = heart.classList.toggle("liked");

            heart.textContent = isLiked ? "♥" : "♡";

            heart.style.color = isLiked
                ? "rgb(225, 82, 135)"
                : "rgb(222, 119, 161)";

            heart.style.transform = "scale(1.3)";

            setTimeout(() => {
                heart.style.transform = "scale(1)";
            }, 200);

            heart.setAttribute(
                "aria-pressed",
                String(isLiked)
            );

            heart.setAttribute(
                "aria-label",
                isLiked ? "Remove from favourites" : "Add to favourites"
            );

            const characterCard = heart.closest(".character-card");

            const characterName = characterCard
                ? characterCard.querySelector("h3")?.textContent.trim()
                : "Character";

            showToast(
                isLiked
                    ? characterName + " added to favourites!"
                    : characterName + " removed from favourites!",
                isLiked ? "💖" : "♡"
            );
        }

        heart.addEventListener("click", toggleHeart);

        heart.addEventListener("keydown", event => {

            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                toggleHeart();
            }

        });

    });


    /* 5. SMOOTH NAVIGATION */

    const navigationLinks = document.querySelectorAll(
        ".nav-links a"
    );

    navigationLinks.forEach(link => {

        link.addEventListener("click", function (event) {

            const targetId = this.getAttribute("href");

            if (!targetId || !targetId.startsWith("#")) {
                return;
            }

            const target = document.querySelector(targetId);

            if (target) {

                event.preventDefault();

                target.scrollIntoView({
                    behavior: prefersReducedMotion ? "auto" : "smooth",
                    block: "start"
                });

            }

        });

    });


    /* 6. ACTIVE NAVIGATION LINK */

    const navigationSections = document.querySelectorAll(
        "section[id]"
    );

    if ("IntersectionObserver" in window) {

        const sectionObserver = new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        navigationLinks.forEach(link => {

                            const isActive =
                                link.getAttribute("href") ===
                                "#" + entry.target.id;

                            link.classList.toggle(
                                "active-link",
                                isActive
                            );

                        });

                    }

                });

            },
            {
                threshold: 0.35
            }
        );

        navigationSections.forEach(section => {
            sectionObserver.observe(section);
        });

    }


    /* 7. ANIMATED STATISTICS */

    const statNumbers = document.querySelectorAll(
        ".stats h2"
    );

    function animateCounter(element) {

        const originalText = element.textContent.trim();

        const match = originalText.match(
            /^(\D*)(\d+(?:\.\d+)?)(.*)$/
        );

        if (!match) return;

        const prefix = match[1];
        const target = Number(match[2]);
        const suffix = match[3];

        const duration = 1600;
        const startTime = performance.now();

        function updateCounter(currentTime) {

            const progress = Math.min(
                (currentTime - startTime) / duration,
                1
            );

            const easedProgress =
                1 - Math.pow(1 - progress, 3);

            const currentValue =
                target * easedProgress;

            const displayValue = Number.isInteger(target)
                ? Math.floor(currentValue)
                : currentValue.toFixed(1);

            element.textContent =
                prefix + displayValue + suffix;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = originalText;
            }

        }

        requestAnimationFrame(updateCounter);
    }


    if (!prefersReducedMotion && "IntersectionObserver" in window) {

        const counterObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        animateCounter(entry.target);
                        observer.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.7
            }
        );

        statNumbers.forEach(number => {
            counterObserver.observe(number);
        });

    }


    /* 8. POKEMON SECTION INTERACTION */

    const pokemonSection = document.querySelector(
        ".pokemon-section"
    );

    if (pokemonSection) {

        const pokemonButton = pokemonSection.querySelector("a");

        if (pokemonButton) {

            pokemonButton.addEventListener("click", function () {

                if (this.getAttribute("href") === "#categories") {
                    showToast(
                        "Let's explore the categories!",
                        "⚡"
                    );
                }

            });

        }

    }


    /* 9. CHARACTER CARD INTERACTIONS */

    const characterCards = document.querySelectorAll(
        ".character-card"
    );

    characterCards.forEach(card => {

        card.addEventListener("mouseenter", function () {

            if (!prefersReducedMotion) {
                this.style.transition =
                    "transform 0.4s ease, box-shadow 0.4s ease";
            }

        });

    });


    /* 10. BUTTON CLICK EFFECT */

    const buttons = document.querySelectorAll(
        ".btn, .watch-btn"
    );

    buttons.forEach(button => {

        button.addEventListener("click", function () {

            this.style.transition = "transform 0.2s ease";
            this.style.transform = "scale(0.96)";

            setTimeout(() => {
                this.style.transform = "";
            }, 180);

        });

    });


    /* 11. BACK TO TOP BUTTON */

    const backToTop = document.createElement("button");

    backToTop.innerHTML = "↑";

    backToTop.setAttribute("aria-label", "Back to top");

    Object.assign(backToTop.style, {

        position: "fixed",
        right: "25px",
        bottom: "25px",
        width: "48px",
        height: "48px",
        border: "none",
        borderRadius: "50%",
        background: "linear-gradient(135deg, rgb(132, 105, 203), rgb(223, 137, 175))",
        color: "white",
        fontSize: "25px",
        fontWeight: "bold",
        cursor: "pointer",
        boxShadow: "0 6px 20px rgba(80, 60, 120, 0.25)",
        opacity: "0",
        visibility: "hidden",
        transform: "translateY(15px)",
        transition: "all 0.35s ease",
        zIndex: "999",
    });

    document.body.appendChild(backToTop);


    window.addEventListener("scroll", function () {

        if (window.scrollY > 400) {

            backToTop.style.opacity = "1";
            backToTop.style.visibility = "visible";
            backToTop.style.transform = "translateY(0)";

        } else {

            backToTop.style.opacity = "0";
            backToTop.style.visibility = "hidden";
            backToTop.style.transform = "translateY(15px)";

        }

    });


    backToTop.addEventListener("click", function () {

        window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion ? "auto" : "smooth"
        });

    });


    /* 12. FOOTER YEAR AUTOMATICALLY */

    const copyright = document.querySelector(".copyright");

    if (copyright) {

        copyright.textContent =
            "© " + new Date().getFullYear() +
            " Dreamy World. All Rights Reserved.";

    }


    /* 13. IMAGE LOADING EFFECT */

    const websiteImages = document.querySelectorAll("img");

    websiteImages.forEach(img => {

        img.addEventListener("error", function () {

            this.style.background = "rgb(245, 235, 250)";

            this.alt = "Image could not be loaded";

        });

    });


    /* 14. PAGE LOADED */

    window.addEventListener("load", function () {

        body.classList.add("website-loaded");

    });

});
