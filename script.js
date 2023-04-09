function vibrar() {
  var img = document.querySelector(".vibrar");
  img.classList.add("vibrando");
  setTimeout(function(){
    img.classList.remove("vibrando");
  }, 500);
}