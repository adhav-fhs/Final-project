const hours = [
	{ day: 0, open: 10, close: 24 },   // Sunday: 10 AM – 12 AM
	{ day: 1, closed: true },          // Monday: Closed
	{ day: 2, open: 10, close: 21 },   // Tuesday: 10 AM – 9 PM
	{ day: 3, open: 10, close: 21 },   // Wednesday: 10 AM – 9 PM
	{ day: 4, open: 10, close: 21 },   // Thursday: 10 AM – 9 PM
	{ day: 5, open: 10, close: 21.5 }, // Friday: 10 AM – 9:30 PM
	{ day: 6, open: 10, close: 21.5 }  // Saturday: 10 AM – 9:30 PM
];


	const statusText = document.getElementById("open-status");
	const navbar = document.querySelector(".contact-navbar");

  // Function that decides if the restaurant is open or closed
  // Uses users current time to determine status
	function updateOpenStatus(currentHour, currentDay) {
		for (let i = 0; i < hours.length; i++) { // Loop through the hours array
			if (hours[i].day === currentDay) {  // Find the object that matches today
				if (hours[i].closed) { // If the day is marked closed, then displays closed or proceeds
					setClosed();
				} else if (currentHour >= hours[i].open && currentHour < hours[i].close) {
					setOpen();   // If current time is within open hours, display open
				} else {
					setClosed();   // Else, it’s outside open hours, display closed
				}
			}
		}
	}

	function setOpen() {
		statusText.textContent = "OPEN NOW";
		statusText.style.color = "#22c55e";
		navbar.style.boxShadow = "0 0 20px rgba(34, 197, 94, 0.6)";
	}

	function setClosed() {
		statusText.textContent = "CLOSED NOW";
		statusText.style.color = "#ef4444";
		navbar.style.boxShadow = "0 0 20px rgba(239, 68, 68, 0.6)";
	}

  // When user clicks the status text, show alert if closed
	statusText.addEventListener("click", () => {
		if (statusText.textContent.includes("CLOSED")) {
			alert("We’re currently closed, but we’ll be happy to serve you when we open!");
		}
	});

  // Function that gets the current time and checks open status
	function checkStatus() {
		const now = new Date();  // Get current date/time
		updateOpenStatus(now.getHours(), now.getDay());  // Update status based on current hour and day
	}

	checkStatus();
	setInterval(checkStatus, 60000); //checks every minute (ms)

alert("Welcome to Bites of India! Feel free to reach out to us with any questions or feedback. And yes the Open Now status is working and changes based on the current time, Mr. Trib!");