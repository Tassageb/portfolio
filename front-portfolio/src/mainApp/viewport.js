export default function isInViewport(element) {
    if (element){
        const rect = element.getBoundingClientRect();
        return Math.max(0, (Math.min(window.innerHeight, rect.bottom) - Math.max(0, rect.top)) / rect.height * 100);
    } else {
        return null
    }
    
}