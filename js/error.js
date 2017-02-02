function googleError() {
    var cssClass; 
    if (typeof google === "undefined") {
        cssClass = "Oops!Something broke, We will be back soon!";
    }
    alert(cssClass);
    $('#map').append('<div class="errormsg">' + cssClass + '</div>');
}