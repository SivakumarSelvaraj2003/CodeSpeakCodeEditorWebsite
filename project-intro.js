
document.getElementById("year").textContent = new Date().getFullYear();
//Moving Text Animation
var typed = new Typed(".p1-span", {
  strings: ["Hyper Text Markup Language"],
  loop: true,
  typeSpeed: 80,
  backSpeed: 80,
});
var typed = new Typed(".p2-span", {
  strings: ["Cascade Style Sheet"],
  loop: true,
  typeSpeed: 80,
  backSpeed: 80,
});
var typed = new Typed(".p3-span", {
  strings: ["JavaScript"],
  loop: true,
  typeSpeed: 80,
  backSpeed: 80,
});
var typed = new Typed(".card-text-span", {
  strings: [
    "HTML stands for Hyper Text Markup Language. HTML is the standard markup language for creating Web pages. HTML describes the structure of a Web page. HTML consists of a series of elements. HTML elements tell the browser how to display the content.",
  ],
  //loop: true,
  typeSpeed: 30,
  backSpeed: 30,
});
var typed = new Typed(".card-text-span2", {
  strings: [
    "Cascading Style Sheets is a style sheet language used for specifying the presentation and styling of a document written in a markup language such as HTML or XML. CSS is a cornerstone technology of the World Wide Web, alongside HTML and JavaScript.",
  ],
  //loop: true,
  typeSpeed: 30,
  backSpeed: 30,
});
var typed = new Typed(".card-text-span3", {
  strings: [
    "JavaScript is a scripting language used to develop web pages. Developed in Netscape, JS allows developers to create a dynamic and interactive web page to interact with visitors and execute complex actions. It also enables users to load content into a document without reloading the entire page.",
  ],
  //loop: true,
  typeSpeed: 30,
  backSpeed: 30,
});

//Accordion
var acc = document.getElementsByClassName("accordion");
var i;
for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function () {
    this.classList.toggle("act");

    var panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });
}
var acc2 = document.getElementsByClassName("accordion2");
var j;
for (j = 0; j < acc2.length; j++) {
  acc2[j].addEventListener("click", function () {
    this.classList.toggle("active2");
  });
}
var acc3 = document.getElementsByClassName("accordion3");
var k;
for (k = 0; k < acc3.length; k++) {
  acc3[k].addEventListener("click", function () {
    this.classList.toggle("active3");
  });
}

//dark mode and light mode
var icon = document.getElementById("icon");
icon.onclick = function () {
  document.body.classList.toggle("dark-theme");
  if (document.body.classList.contains("dark-theme")) {
    icon.src = "images/crescent-moon-png-35116 (1).png";
  } else {
    icon.src = "images/sun-256.png";
  }
};
