const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/sistema_agendadmento', {useNewUrlParser: true, useUnifiedTopology: true});


app.get('/', (req, res) => {
	res.send('Hello, world!');
});

app.get('/cadastro', (req, res) => {
	res.render('create');
});



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Rodando na porta: ${PORT}`);
});
