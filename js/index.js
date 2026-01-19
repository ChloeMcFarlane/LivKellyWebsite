// NAV BAR

const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// SCROLL REVEAL FUNCTIONALITY
class ScrollReveal {
    constructor() {
        this.revealElements = document.querySelectorAll('.scroll-reveal');
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.createObserver();
        } else {
            // Fallback for browsers that don't support IntersectionObserver
            this.revealElements.forEach(el => el.classList.add('revealed'));
        }
    }

    createObserver() {
        const options = {
            root: null,
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Add stagger delay for multiple elements
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, delay);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        this.revealElements.forEach(el => observer.observe(el));
    }
}

// GALLERY FUNCTION
class LazyImageLoader{constructor(){this.imageObserver=null;this.init()}init(){if('IntersectionObserver'in window){this.imageObserver=new IntersectionObserver((entries,observer)=>{entries.forEach(entry=>{if(entry.isIntersecting){this.loadImage(entry.target);observer.unobserve(entry.target)}})},{rootMargin:'50px',threshold:0.01});this.observeImages()}else{this.loadAllImages()}}observeImages(){const lazyImages=document.querySelectorAll('.lazy-image');lazyImages.forEach(img=>{this.imageObserver.observe(img)})}loadImage(img){const src=img.getAttribute('data-src');if(!src)return;const tempImage=new Image();tempImage.onload=()=>{img.src=src;img.classList.add('loaded');img.removeAttribute('data-src')};tempImage.onerror=()=>{console.error(`Failed to load image: ${src}`);img.classList.add('loaded','error');img.alt='Failed to load image'};tempImage.src=src}loadAllImages(){const lazyImages=document.querySelectorAll('.lazy-image');lazyImages.forEach(img=>this.loadImage(img))}}

class ScrollNavigation{constructor(containerId,leftBtnId,rightBtnId){this.container=document.getElementById(containerId);this.leftBtn=document.getElementById(leftBtnId);this.rightBtn=document.getElementById(rightBtnId);if(this.container&&this.leftBtn&&this.rightBtn){this.init()}}init(){this.scrollAmount=620;this.leftBtn.addEventListener('click',()=>this.scroll('left'));this.rightBtn.addEventListener('click',()=>this.scroll('right'));this.container.addEventListener('scroll',()=>this.updateButtonVisibility());this.updateButtonVisibility();window.addEventListener('resize',()=>this.updateButtonVisibility())}scroll(direction){const scrollLeft=this.container.scrollLeft;const targetScroll=direction==='left'?scrollLeft-this.scrollAmount:scrollLeft+this.scrollAmount;this.container.scrollTo({left:targetScroll,behavior:'smooth'})}updateButtonVisibility(){const{scrollLeft,scrollWidth,clientWidth}=this.container;if(scrollLeft<=0){this.leftBtn.classList.add('hidden')}else{this.leftBtn.classList.remove('hidden')}if(scrollLeft+clientWidth>=scrollWidth-1){this.rightBtn.classList.add('hidden')}else{this.rightBtn.classList.remove('hidden')}}}

function debounce(func,wait){let timeout;return function executedFunction(...args){const later=()=>{clearTimeout(timeout);func(...args)};clearTimeout(timeout);timeout=setTimeout(later,wait)}}

document.addEventListener('DOMContentLoaded',()=>{
    // Initialize Scroll Reveal
    const scrollReveal = new ScrollReveal();
    
    const lazyLoader=new LazyImageLoader();
    const scrollNav=new ScrollNavigation('scrollContainer','scrollLeft','scrollRight');
    
    document.addEventListener('keydown',(e)=>{
        const container=document.getElementById('scrollContainer');
        if(!container)return;
        if(e.key==='ArrowLeft'){
            e.preventDefault();
            document.getElementById('scrollLeft').click()
        }else if(e.key==='ArrowRight'){
            e.preventDefault();
            document.getElementById('scrollRight').click()
        }
    });
    
    const firstImages=document.querySelectorAll('.lazy-image');
    if(firstImages.length>0){
        lazyLoader.loadImage(firstImages[0]);
        if(firstImages.length>1){
            lazyLoader.loadImage(firstImages[1])
        }
    }
});

let touchStartX=0;
let touchEndX=0;
document.addEventListener('DOMContentLoaded',()=>{
    const container=document.getElementById('scrollContainer');
    if(!container)return;
    container.addEventListener('touchstart',(e)=>{
        touchStartX=e.changedTouches[0].screenX
    },{passive:true});
    container.addEventListener('touchend',(e)=>{
        touchEndX=e.changedTouches[0].screenX;
        handleSwipe()
    },{passive:true});
    function handleSwipe(){
        const swipeThreshold=50;
        const diff=touchStartX-touchEndX;
        if(Math.abs(diff)>swipeThreshold){
            if(diff>0){
                document.getElementById('scrollRight')?.click()
            }else{
                document.getElementById('scrollLeft')?.click()
            }
        }
    }
});