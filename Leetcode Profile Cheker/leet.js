document.addEventListener("DOMContentLoaded", function () {

    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.querySelector("input");

    const easyCircle = document.getElementById("easy");
    const mediumCircle = document.getElementById("medium");
    const hardCircle = document.getElementById("hard");

    const cards = document.querySelectorAll(".progresscard");

    function validateUsername(username) {
        if (username.trim() === "") {
            alert("Username should not be empty!");
            return false;
        }
        return true;
    }

    function animateNumber(element, target) {
        let current = 0;
        const increment = Math.ceil(target / 40);

        const update = () => {
            current += increment;
            if (current > target) current = target;
            element.textContent = current;

            if (current < target) requestAnimationFrame(update);
        };
        update();
    }

    function animateCircle(element, solved, total) {
        let degree = 0;
        const targetDegree = (solved / total) * 360;

        const increase = () => {
            degree += 4;
            if (degree > targetDegree) degree = targetDegree;

            element.style.background = `
                conic-gradient(#00eaff ${degree}deg, #1a1a1a 0deg)
            `;

            if (degree < targetDegree) requestAnimationFrame(increase);
        };
        increase();
    }

    async function fetchUserDetails(username) {
        try {
            searchButton.textContent = "Fetching...";
            searchButton.disabled = true;

            const proxy = "https://cors-anywhere.herokuapp.com/";
            const target = "https://leetcode.com/graphql/";

            const graphqlQuery = {
                query: `
                query userSessionProgress($username: String!) {
                    allQuestionsCount {
                        difficulty
                        count
                    }
                    matchedUser(username: $username) {
                        submitStats {
                            acSubmissionNum {
                                difficulty
                                count
                            }
                        }
                    }
                }
                `,
                variables: { username }
            };

            const response = await fetch(proxy + target, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(graphqlQuery)
            });

            const json = await response.json();
            if (!json.data || !json.data.matchedUser) {
                throw new Error("User not found!");
            }

            const allQ = json.data.allQuestionsCount;
            const stats = json.data.matchedUser.submitStats.acSubmissionNum;

            let totalEasy = allQ.find(x => x.difficulty === "Easy").count;
            let totalMedium = allQ.find(x => x.difficulty === "Medium").count;
            let totalHard = allQ.find(x => x.difficulty === "Hard").count;

            let easy = stats.find(x => x.difficulty === "Easy").count;
            let medium = stats.find(x => x.difficulty === "Medium").count;
            let hard = stats.find(x => x.difficulty === "Hard").count;

            showUI({
                easySolved: easy,
                mediumSolved: medium,
                hardSolved: hard,
                totalSolved: easy + medium + hard,
                totalEasy,
                totalMedium,
                totalHard
            });

        } catch (err) {
            alert(err.message);
        } finally {
            searchButton.textContent = "Submit";
            searchButton.disabled = false;
        }
    }

    function showUI(data) {
        animateCircle(easyCircle, data.easySolved, data.totalEasy);
        animateCircle(mediumCircle, data.mediumSolved, data.totalMedium);
        animateCircle(hardCircle, data.hardSolved, data.totalHard);

        const details = [
            { title: "Total Solved", value: data.totalSolved },
            { title: "Easy Solved", value: data.easySolved },
            { title: "Medium Solved", value: data.mediumSolved },
            { title: "Hard Solved", value: data.hardSolved }
        ];

        cards.forEach((card, index) => {
            card.innerHTML = `
                <div class="card-title">${details[index].title}</div>
                <div class="card-value" id="val${index}">0</div>
            `;

            animateNumber(document.getElementById(`val${index}`), details[index].value);
        });
    }

    searchButton.addEventListener("click", handleSearch);
    usernameInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            handleSearch();
        }
    });

    function handleSearch() {
        const username = usernameInput.value;
        if (validateUsername(username)) {
            fetchUserDetails(username);
        }
    }
});