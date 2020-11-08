const express = require ('express');
const app = express();


app.use(express.static('./dist/peliculasApp'));

app.get('/*', function(req, res) {
  res.sendFile('index.html', {root: 'dist/peliculasApp/'}
);
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`Example app listening at http://localhost:8080`)
})