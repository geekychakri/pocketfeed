const svgIconCopy = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#888888" d="M15.24 2h-3.894c-1.764 0-3.162 0-4.255.148c-1.126.152-2.037.472-2.755 1.193c-.719.721-1.038 1.636-1.189 2.766C3 7.205 3 8.608 3 10.379v5.838c0 1.508.92 2.8 2.227 3.342c-.067-.91-.067-2.185-.067-3.247v-5.01c0-1.281 0-2.386.118-3.27c.127-.948.413-1.856 1.147-2.593s1.639-1.024 2.583-1.152c.88-.118 1.98-.118 3.257-.118h3.07c1.276 0 2.374 0 3.255.118A3.6 3.6 0 0 0 15.24 2"/><path fill="#888888" d="M6.6 11.397c0-2.726 0-4.089.844-4.936c.843-.847 2.2-.847 4.916-.847h2.88c2.715 0 4.073 0 4.917.847S21 8.671 21 11.397v4.82c0 2.726 0 4.089-.843 4.936c-.844.847-2.202.847-4.917.847h-2.88c-2.715 0-4.073 0-4.916-.847c-.844-.847-.844-2.21-.844-4.936z"/></svg>`;
const svgIconCheck = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#888888" fill-rule="evenodd" d="M18.493 6.935a.75.75 0 0 1 .072 1.058l-7.857 9a.75.75 0 0 1-1.13 0l-3.143-3.6a.75.75 0 0 1 1.13-.986l2.578 2.953l7.292-8.353a.75.75 0 0 1 1.058-.072" clip-rule="evenodd"/></svg>`;

document.querySelectorAll("pre").forEach((pre) => {
  // Create wrapper, button, and message elements
  const wrapper = document.createElement("div");
  const button = document.createElement("button");
  // const message = document.createElement("div");
  // Set up the wrapper and button
  wrapper.style.position = "relative";
  button.innerHTML = svgIconCopy;
  button.style.position = "absolute";
  button.style.top = "0";
  button.style.right = "0";
  // button.style.background = "#FF6D2D";
  // button.style.color = "#2F2F2F";
  button.style.padding = "5px 12px";
  // pre.style.paddingTop = "3.5rem";
  // pre.style.whiteSpace = "pre-wrap";
  // pre.style.wordBreak = "break-word";
  // Set up the message
  // message.style.position = "absolute";
  // message.style.bottom = "20px";
  // message.style.right = "0";
  // message.style.background = "black";
  // message.style.color = "white";
  // message.style.padding = "5px";
  // message.style.borderRadius = "5px";
  // message.style.display = "none";
  // message.textContent = "Code Copied!";
  // Add wrapper and button to the DOM
  pre.parentNode?.insertBefore(wrapper, pre);
  wrapper.appendChild(pre);
  wrapper.appendChild(button);
  // wrapper.appendChild(message);
  // Copy action
  button.addEventListener("click", () => {
    button.innerHTML = "COPIED";
    // sound.play();
    navigator.clipboard
      .writeText(pre.textContent)
      .then(() => {
        // Show message
        // message.style.display = "block";
        // Hide message after 2 seconds
        setTimeout(() => {
          // message.style.display = "none";
          button.innerHTML = svgIconCopy;
        }, 1000);
      })
      .catch((err) => console.error("Error copying text: ", err));
  });
});
