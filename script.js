const parallax_el = document.querySelectorAll(".parallax");
const main = document.querySelector("main");
let xValue = 0,
yValue = 0;

let rotateDegree = 0;

function update(cursorPosition) {
  parallax_el.forEach((el)=> {
    let speedx = el.dataset.speedx;
    let speedy = el.dataset.speedy;
    let speedz = el.dataset.speedz;
    let rotateSpeed = el.dataset.rotation;
 
    let isInLeft = 
    parseFloat(getComputedStyle(el).left) < window.innerWidth / 2 ? 1 : -1;
     let zValue = 
     (cursorPosition - parseFloat( getComputedStyle(el).left)) * isInLeft * 0.1;
    
 
     el.style.transform = `perspective(2300px) translateZ(${
       zValue * speedz
     }px) rotateY(${rotateDegree * rotateSpeed}deg) translateX(calc(-50% + ${
       -xValue * speedx
     }px)) translateY(calc(-50% + ${yValue * speedy}px))`;
  });
}
update(0)

window.addEventListener("mousemove", (e)=> {
 if(timeline.isActive()) return;

 xValue = e.clientX - window.innerWidth / 2;
 yValue = e.clientY - window.innerHeight / 2;

 rotateDegree = (xValue / (window.innerWidth / 2)) * 20;

 update(e.clientX);
});

if (window.innerWidth >= 725){
  main.style.maxHeight = `${window.innerwidth * 0.6}px`;
} else{
  main.style.maxHeight = `${window.innerwidth * 1.6}px`;
}

/* GSAP */
let timeline = gsap.timeline();

 Array.from(parallax_el)
 .filter((el) => !el.classList.contains("text"))
 .forEach(el => {

  timeline.from(el, 
    {
    top: `${el.offsetHeight/ 2 + +el.dataset.distance}px `,
    duration: 3.5,
    ease: "power3.out"
  },
  "1"
  );
 });
 timeline.from(".text h2",{
  y:
  window.innerHeight - document.querySelector(".text h2").getBoundingClientRect().top + 200,
  duration:2,
 }, "1.5")

 .from(".hide", {
  opacity: 0,
  duration: 1.5,
 }, "3");

/*cursor */
const cursorRounded = document.querySelector('.rounded');
const cursorPointed = document.querySelector('.pointed');


const moveCursor = (e)=> {
  const mouseY = e.clientY;
  const mouseX = e.clientX;
   
  cursorRounded.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  
  cursorPointed.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
 
}

window.addEventListener('mousemove', moveCursor)


// Get a reference to the audio element
const clickSound = document.getElementById("click-sound");

// Function to play the click sound
function playClickSound() {
    clickSound.currentTime = 0; // Reset the audio to the beginning (in case it's already playing)
    clickSound.play(); // Play the audio
}

// Attach the playClickSound function to elements you want to have the click sound
const clickableElements = document.querySelectorAll(".clickable-element"); // Replace with the actual class name of clickable elements

clickableElements.forEach((element) => {
    element.addEventListener("click", playClickSound);
});
var sound1 = new Audio ();
sound1.scr = "MAKEUP/l96.mp3";
