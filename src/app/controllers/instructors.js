const { age, date } = require('../../lib/utils')
//const db = require('../../config/db')
const Instructor = require('../models/instructor')

module.exports = {
  index(req, res) {
    let {filter,page,limit } = req.query //desestruturando e pegando o filtro

    page = page || 1 //se não existir page, coloca como 1
    limit = limit || 2 //mesma coisa
    let offset = limit *(page-1) //logica para paginação!

    const params = {
      filter,
      page,
      limit,
      offset,
      callback(instructors){
        return res.render("instructors/index", { instructors,filter })
      }
    }
    Instructor.paginate(params)//enviando callback dentro do params



    // if(filter){
    //   Instructor.findBy(filter,function(instructors){
    //     return res.render("instructors/index", { instructors,filter })
    //   })
    // }else {
    //     //Inserindo a função no instructor e puxando o callback !
    // Instructor.all(function (instructors) {
    //   return res.render("instructors/index", { instructors })
     
    //   //Aqui eu to pegando o results.rows do bd ! puxando pela query e jogando como ''instructors'' para o views/nunjucks. que vai fazer a transformação!
    // })
    // }

  
  },
  create(req, res) {
    return res.render('instructors/create')
  },
  post(req, res) {
    const keys = Object.keys(req.body)//Pesquisar o que estou fazendo aqui !
    for (key of keys) {
      //Verificando se algo no objeto esta vazio!
      if (req.body[key] == "") {
        return res.send("Please, fill all fields !")
      }
    }

    Instructor.create(req.body, function (instructor) {
      return res.redirect(`/instructors/${instructor.id}`)//dps pesquisar o que ta rolando aqui
    })
  },
  show(req, res) {
    Instructor.find(req.params.id, function (instructor) {

      if (!instructor) res.send("Instructor not found!")
      instructor.age = age(instructor.birth)
      instructor.services = instructor.services.split(",")
      instructor.created_at = date(instructor.created_at).format
      return res.render("instructors/show", { instructor })

    })


  },
  edit(req, res) {
    Instructor.find(req.params.id, function (instructor) {

      if (!instructor) res.send("Instructor not found!")
      instructor.birth = date(instructor.birth).iso // tem q passar para esse formato para o site aceitar a data
      return res.render("instructors/edit", { instructor })

    })


  },
  put(req, res) {
    const keys = Object.keys(req.body) //faz um array com nome das chaves do objeto !(não pega os valores)
    //object é um constructor que vai criar uma função

    //percorrer o array e verificar !
    for (key of keys) {
      //req.body.avatar_url (mesma coisa !!!) js entende
      if (req.body[key] == "") {
        return res.send("Please, fill all fields !")
      }
    }
    Instructor.update(req.body, function(){
      return res.redirect(`/instructors/${req.body.id}`)
    })
  },
  delete(req, res) {

    Instructor.delete(req.body.id, function(){
      return res.redirect(`/instructors`)
    })
  }
}
