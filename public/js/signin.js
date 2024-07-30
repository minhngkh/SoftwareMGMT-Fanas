document.querySelectorAll(".item-D").forEach((item) => {
  item.addEventListener("click", function () {
    const selectedText = this.innerHTML; // Get the innerHTML of the clicked <li>
    document.querySelector(".box-D span").innerHTML = selectedText; // Set the <span> content to the clicked <li> content
  });
});
document.querySelector(".box-D i").addEventListener("click", function () {
  const domainItem = document.querySelector(".domain-item");
  domainItem.style.display =
    domainItem.style.display === "none" ? "block" : "none";
});

document.querySelectorAll(".item-D").forEach((item) => {
  item.addEventListener("click", function () {
    const selectedText = this.innerHTML; // Get the innerHTML of the clicked <li>
    document.querySelector(".box-D span").innerHTML = selectedText; // Set the <span> content to the clicked <li> content
    document.querySelector(".domain-item").style.display = "none"; // Hide the domain-item
  });
});

// Hide the domain-item when clicking outside of it
document.addEventListener("click", function (event) {
  const domainItem = document.querySelector(".domain-item");
  const boxD = document.querySelector(".box-D");
  if (!boxD.contains(event.target) && !domainItem.contains(event.target)) {
    domainItem.style.display = "none";
  }
});
