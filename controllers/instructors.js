const fs = require('fs') //file system , para trabalhar com arquivos do sistema
const data = require("../data.json")
const { age, date } = require('../utils')


//index
exports.index =(req, res) => {

  return res.render('instructors/index',{instructors: data.instructors})
}
//show
exports.show = (req, res) => {
  //req.params
  const { id } = req.params
  //usando o find para achar o instrutor correto
  const foundInstructor = data.instructors.find((instructor) => {
    return id == instructor.id // retornando true ou false
  })
  //Se não achou instrutor cai nessa linha !
  if (!foundInstructor) return res.send("Instructor not found")

  function created(timestamp) {
    const date = new Date(timestamp)
    const today = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()

    return `${today}/${month}/${year}`
  }

  const instructor = {
    //usando o spread
    ...foundInstructor,
    age: age(foundInstructor.birth),
    services: foundInstructor.services.split(","),
    created_at: created(foundInstructor.created_at),
  }

  return res.render("instructors/show", { instructor: instructor })//enviando objeto
}
//create
exports.post = (req, res) => {
  //post tem que usar req.body
  //get usa req.query
  //return res.send("oi")

  const keys = Object.keys(req.body) //faz um array com nome das chaves do objeto !(não pega os valores)
  //object é um constructor que vai criar uma função

  //percorrer o array e verificar !
  for (key of keys) {
    //req.body.avatar_url (mesma coisa !!!) js entende
    if (req.body[key] == "") {
      return res.send("Please, fill all fields !")
    }
  }


  //desestruturar e pegar só o q vc pedir
  let { avatar_url, birth, name, services, gender } = req.body //Desestruturando !

  birth = Date.parse(birth)
  const created_at = Date.now()
  const id = Number(data.instructors.length + 1) //adicionando uma variavel + 1


  data.instructors.push({
    id,
    avatar_url,
    name,
    birth,
    gender,
    services,
    created_at
  })// [{}]

  //escrevendo no arquivo
  //primeiro é o caminho !
  //segunda opção é o objeto
  //terceira opção é o callback function ->dps de receber o arquivo ele executa a função
  //bom para usar se o sistema não bloquear

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {

    if (err) { return res.send("Write file error!") }
    res.redirect(`/instructors`)
  })

  //return res.send(req.body)
}
exports.edit = (req, res) => {
  //req.params
  const { id } = req.params
  //usando o find para achar o instrutor correto
  const foundInstructor = data.instructors.find((instructor) => {
    return id == instructor.id // retornando true ou false
  })
  //Se não achou instrutor cai nessa linha !
  if (!foundInstructor) return res.send("Instructor not found")

  const instructor = {
    ...foundInstructor,
    birth: date(foundInstructor.birth).iso
  }

  return res.render('instructors/edit', { instructor })
}
//update->put
exports.put = (req, res) => {
  const { id } = req.body
  let index = 0 
  //usando o find para achar o instrutor correto
  const foundInstructor = data.instructors.find((instructor,foundIndex) => {
     if(id == instructor.id){
      index =foundIndex
      return true
     } 
  })
  //Se não achou instrutor cai nessa linha !
  if (!foundInstructor) return res.send("Instructor not found")

  const instructor = {
    ...foundInstructor,
    ...req.body,
    birth: Date.parse(req.body.birth),
    id: Number(req.body.id)
  }

  data.instructors[index] = instructor

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {

    if (err) { return res.send("Write edit error!") }
    return res.send("instrutor editado")
    return res.redirect(`/instructors/${id}`)
  })
}
exports.delete = (req,res)=>{
  //pegando req.body que é enviado via metodo phost!
  const {id} =req.body

  const filteredInstructors = data.instructors.filter((instructor)=>{
    return instructor.id !=id //selecionando todos menos o do delete!
  })

  data.instructors = filteredInstructors

  fs.writeFile("data.json",JSON.stringify(data,null,2), function(err){
    if(err) return res.send ("write file error")

    return res.send("instrutor deletado")
    return res.redirect("/instructors")
  })
}
exports.create =  (req, res) => {
  return res.render('instructors/create')
}

//delete