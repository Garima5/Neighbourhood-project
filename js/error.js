var cssClass;
var text;
if (typeof google === 'undefined') {
  cssClass = 'not-loaded';
  text += 'not loaded 😞';
} else {
  cssClass = 'loaded';
  text += 'loaded 😀'
}
console.log(text);