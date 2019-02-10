export default {

  colorMinder(char){
    let groups = ['a','b','c','d','m','n','o','p','q','r','s','t',
    'e','f','g','h','u','v','w','x','i','j','k','l','y','z'];
    let charIndex = groups.indexOf(char.toLowerCase()) + 1;

    return charIndex <= 4 ? 'teal' :
    charIndex <= 8 ? 'purple' : 
    charIndex <= 12 ? 'success' : 
    charIndex <= 18 ? 'secondary' : 
    charIndex <= 24 ? 'orange' : 
    'primary'
  },
  truncateText(text,length=18){
    return text.replace(/(.{length})..+/, "$1...");
  },
  
}