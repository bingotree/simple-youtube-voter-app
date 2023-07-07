const express = require('express')
const app = express()
const port = process.env.PORT || 3000

});
// res.render('random', {title: 'hiya', paragraphs: 'words', links: links});

app.get('/', (req, res) => res.send('derp'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
