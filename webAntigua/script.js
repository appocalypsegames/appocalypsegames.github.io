let veces=1000000;
function vibrar() {
  var img = document.querySelector(".vibrar");
  img.classList.add("vibrando");
  setTimeout(function(){
    img.classList.remove("vibrando");
  }, 500);
  veces--;
  document.getElementById("textoTamago").innerHTML="Click "+veces.toLocaleString('es-ES', {minimumFractionDigits: 0})+" times on the Illuminati egg and discover what is inside.";
  if(veces <= 0){
	  document.getElementById("textoTamago").innerHTML="YOU ARE ILLUMINATI.";
	  img.src = "images/illuminati.png";
  }
}
document.addEventListener("DOMContentLoaded", function() {
	// Get the element by its ID
	var year = document.getElementById("year");
	// Update the innerHTML with the current year
	year.innerHTML = "© " + new Date().getFullYear() + " Appocalypse Games";
});