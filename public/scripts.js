const currentPage = location.pathname
const menuItems = document.querySelectorAll("header .links a")
//utilizando o inclues para verificar se tem o valor na string , retornando true entra na function
for(item of menuItems){
  if(currentPage.includes(item.getAttribute("href"))){
    item.classList.add("active")
  }
}