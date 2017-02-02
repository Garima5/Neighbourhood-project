function googleError() {
    //help from Udacity link
    var cssClass; 
    if (typeof google === "undefined") {
        cssClass = "Oops!Something broke, We will be back soon!";
    }
    alert(cssClass);
    $('#map').append('<div class="errormsg">' + cssClass + '</div>');
}
