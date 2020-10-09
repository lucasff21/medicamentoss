const express = require('express')
const app = express()
const bodyparser = require('body-parser')
var path = require('path')

const ObjectId = require('mongodb').ObjectID

const MongoClient = require('mongodb').MongoClient
const uri = "mongodb+srv://teste:teste123@cluster0.x9qze.mongodb.net/<crud>?retryWrites=true&w=majority"

MongoClient.connect(uri, (err, client) => {
    if (err) return console.log(err)
    db = client.db('crud') // coloque o nome do seu DB
   
    app.listen(3000, () => {
      console.log('Server running on port 3000')
    })
  })

app.use(bodyparser.urlencoded({ extended: true}))

app.use(express.static('public'));

app.set('view engine', 'ejs')

app.set('views', path.join(__dirname, 'views'));

////////////////////////// CARREGAR PAG DE INSERIR DADOS /////////////////////////
app.get('/medicamentos', function(req, res){
    res.render('pages/medicamentos/index.ejs');
})

//////////////////////////////////    RENDERIZAR DADOS         ////////////////////////////////////////////////////////////
app.get('/listarmedicamentos', (req, res) => {
  db.collection('medicamento').find().toArray((err, results) => { 
      if (err) return console.log(err)
      console.log(results)
      res.render('pages/medicamentos/visualizar.ejs', {medicamento: results })

  })
})


app.post('/salvarmedicamentos', (req, res)=>{
    //criar a coleção medicamento, que irá armazenar nossos dados
    db.collection('medicamento').save(req.body, (err, result) => {
        if (err) return console.log(err)
     
        console.log('Salvo no Banco de Dados')
        res.redirect('/listarmedicamentos')
      })
});
/////////////////////////////////////////////////   EDITAR  ///////////////////////////////////////////////////////////////////

app.route('/editmedico/:id')

.get((req, res) => {
  var id = req.params.id
    db.collection('medicamento').find(ObjectId(id)).toArray((err, result) => {
        if (err) return res.send(err)
        res.render('pages/medicamentos/editar.ejs', { medicamento: result })
    })
})

.post((req, res) => {
  var id = req.params.id
  var name = req.body.name
  var horas = req.body.horas
  var substancia = req.body.substancia
  var dosagem = req.body.dosagem
  var marca = req.body.marca
  var lab = req.body.lab
  var tomar = req.body.tomar
  var teste = req.body.teste
  
  db.collection('medicamento').updateOne({_id: ObjectId(id)}, {
      $set: {
        name:name,
        horas: horas,
        substancia:substancia,
        dosagem: dosagem,
        marca:marca,
        lab: lab,
        tomar:tomar,
        teste: teste
      }
    }, (err, result) => {
      if (err) return res.send(err)
      
      console.log('Banco Atualizado com Sucesso!')
      res.redirect('/listarmedicamentos')
      
    })
})


///////////////////////// DELETAR ///////////////
app.route('/delete/:id')
.get((req, res) => {
  var id = req.params.id

  db.collection('medicamento').deleteOne({_id: ObjectId(id)},
  (err, result) => {
      if (err) return console.log(err)
      console.log('Valor removido com Sucesso!')
      res.redirect('/listarmedicamentos')
    })
})
