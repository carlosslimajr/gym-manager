const fs = require('fs') //file system , para trabalhar com arquivos do sistema
const data = require("../data.json")
const { date } = require('../utils')


//index
exports.index =(req, res) => {

  return res.render('members/index',{members: data.members})
}

//show
exports.show = (req, res) => {
  //req.params
  const { id } = req.params
  //usando o find para achar o membro correto
  const foundMember = data.members.find((member) => {
    return id == member.id // retornando true ou false
  })
  //Se não achou membro cai nessa linha !
  if (!foundMember) return res.send("Member not found")

  function created(timestamp) {
    const date = new Date(timestamp)
    const today = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()

    return `${today}/${month}/${year}`
  }

  const member = {
    //usando o spread
    ...foundMember,
    birth: date(foundMember.birth).birthday
  }

  return res.render("members/show", { member: member })//enviando objeto
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
  // let { avatar_url, birth, name,email , gender,blood,weight,height } = req.body //Desestruturando !

  birth = Date.parse(req.body.birth)

  let id =1;
  const lastMember = data.members[data.members.length - 1]//adicionando uma variavel + 1
  //Fazendo calculo para se não tiver um id ainda, criar !
  if(lastMember){
    id = lastMember.id +1
  }


  data.members.push({
    id,
    ...req.body,
    birth,
  }
  )// [{}]

  //escrevendo no arquivo
  //primeiro é o caminho !
  //segunda opção é o objeto
  //terceira opção é o callback function ->dps de receber o arquivo ele executa a função
  //bom para usar se o sistema não bloquear

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {

    if (err) { return res.send("Write file error!") }
    return res.send("membro criado")
    return res.render('views/members')
  })

  //return res.send(req.body)
}

exports.edit = (req, res) => {
  //req.params
  const { id } = req.params
  //usando o find para achar o membro correto
  const foundMember = data.members.find((member) => {
    return id == member.id // retornando true ou false
  })
  //Se não achou membro cai nessa linha !
  if (!foundMember) return res.send("Member not found")

  const member = {
    ...foundMember,
    birth: date(foundMember.birth).iso
  }

  return res.render('members/edit', { member })
}
//update->put
exports.put = (req, res) => {
  const { id } = req.body
  let index = 0 
  //usando o find para achar o membro correto
  const foundMember = data.members.find((member,foundIndex) => {
     if(id == member.id){
      index =foundIndex
      return true
     } 
  })
  //Se não achou membro cai nessa linha !
  if (!foundMember) return res.send("Member not found")

  const member = {
    ...foundMember,
    ...req.body,
    birth: Date.parse(req.body.birth),
    id: Number(req.body.id)
  }

  data.members[index] = member

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {

    if (err) { return res.send("Write edit error!") }
    return res.send("membro editado")
    return res.redirect(`/members/${id}`)
  })
}
exports.delete = (req,res)=>{
  //pegando req.body que é enviado via metodo phost!
  const {id} =req.body

  const filteredMembers = data.members.filter((member)=>{
    return member.id !=id //selecionando todos menos o do delete!
  })

  data.members = filteredMembers

  fs.writeFile("data.json",JSON.stringify(data,null,2), function(err){
    if(err) return res.send ("write file error")

    return res.send("membro deletado")
    return res.redirect("/members")
  })
}
exports.create =  (req, res) => {
  return res.render('members/create')
}

//delete