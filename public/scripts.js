const currentPage = location.pathname
const menuItems = document.querySelectorAll("header .links a")
//utilizando o inclues para verificar se tem o valor na string , retornando true entra na function
for(item of menuItems){
  if(currentPage.includes(item.getAttribute("href"))){
    item.classList.add("active")
  }
}

function pagination(){
  //logica de paginação 
let totalPages = 20,
selectedPage=15,
pages = [],
oldPage

for(let currentPage = 1; currentPage<=totalPages;currentPage++){
  
  const firstAndLastPage = currentPage == 1 || currentPage == totalPages
  const pagesAfterSelectedPage = currentPage <= selectedPage +2 // logica para criar as paginas antes e depois !
  const pagesBeforeSelectedPage = currentPage >= selectedPage -2

  if(firstAndLastPage ||pagesAfterSelectedPage && pagesBeforeSelectedPage){
    if(oldPage && currentPage -oldPage>2){
      pages.push("...")
    }
    if(oldPage && currentPage - oldPage==2){
      pages.push(oldPage+1)
    }
    pages.push(currentPage)
    oldPage = currentPage
  }

}
console.log(pages)
}