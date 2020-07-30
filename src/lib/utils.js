module.exports = {
  age: function (timestamp) {
    //Logica de idade !
    const today = new Date() //criando uma nova data e jogando no today
    const birthDate = new Date(timestamp)

    let age = today.getFullYear() - birthDate.getFullYear() //Fazendo calculo para pegar a idade
    const month = today.getMonth() - birthDate.getMonth()//Pegando mes para saber se já fez niver
    const day = today.getDate() - birthDate.getDate() //Pega de 1 - 31
    if (month < 0 || month == 0 && day <= 0) {
      age = age - 1
    }
    return age
  },
  date: function (timestamp) {
    const date = new Date(timestamp)

    //pegando o ano
    const year = date.getUTCFullYear()
    //mes
    const month = `0${date.getUTCMonth() + 1}`.slice(-2)
    //dia
    const day = `0${date.getUTCDate()}`.slice(-2)

    return {
      day,
       month,
        year,
         iso: `${year}-${month}-${day}`,
         birthday: `${day}-${month}`,
         format: `${day}/${month}/${year}`,//para o db
    }
    // return `${year}-${month}-${day}`

  }
}