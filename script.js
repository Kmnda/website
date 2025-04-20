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

// Click popup animation
const clickPopup = document.getElementById('click-popup');

document.addEventListener('click', (e) => {
    // Position the popup at click coordinates
    clickPopup.style.left = (e.clientX - 25) + 'px';
    clickPopup.style.top = (e.clientY - 25) + 'px';
    
    // Add active class to show animation
    clickPopup.classList.add('active');
    
    // Remove active class after animation completes
    setTimeout(() => {
        clickPopup.classList.remove('active');
    }, 300);
});
