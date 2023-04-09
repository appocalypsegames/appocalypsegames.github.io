let veces=1000000;
function vibrar() {
  var img = document.querySelector(".vibrar");
  img.classList.add("vibrando");
  setTimeout(function(){
    img.classList.remove("vibrando");
  }, 500);
  veces--;
  document.getElementById("textoTamago").innerHTML="Click "+veces+" times on the Illuminati egg and discover what is inside.";
  if(veces <= 0){
	  document.getElementById("textoTamago").innerHTML="YOU ARE ILLUMINATI.";
	  img.src = "images/illuminati.png";
  }
}