const express   = require('express')
const router    = express.Router()
const Article   = require('../models/Article')

// Get on element
router.get('/detail/:id', (req, res) => {
    let idArticle = req.params.id;

    Article.findAll({
        where: {
            id: idArticle,
            user_id: req.user.id
        },
    })
    .then(article => {
        res.send(article)
    })
    .catch(err => console.log('Not possible recure elemente' + err))

})

// Delete Article
router.post('/delete', (req, res) => {
    
    let idArticle = req.body.id;
    
    Article.destroy({
        where: {
            id: idArticle,
            user_id: req.user.id
        }
    })
    .then(() => res.send(true))
    .catch(err => console.log('Delete erro' + err))
})

// Update Article
router.post('/update', (req, res) => {
    let {id, name, acquisition, paid, description} = req.body;

    Article.findByPk(id)
    .then((article) => {
        article.name = name
        article.acquisition = acquisition
        article.paid = paid
        article.description = description
        if(article.user_id == req.user.id)
        return article.save()
    })
    .then(() => res.send(true))
    .catch(err => console.log('Update erro' + err))
})

// List article
router.get('/list', (req, res) =>{

    Article.findAll({
        where: {user_id: req.user.id},
        order: [
            ['id', 'DESC']
        ]
    })
    .then(articles => {
        res.render('articleList', {articles});
    })
    .catch(err => console.log('Erro Articles get: ' + err))
})

// form add article
router.get('/add', (req, res) => {
    res.render('articleAdd')
})

// add Article
router.post('/add', (req, res) => {
    let {name, acquisition, paid, description} = req.body;
    let user_id = req.user.id;

    // insert
    Article.create({
        user_id,
        name,
        acquisition,
        paid,
        description
    })
    .then(() => res.redirect('/aplicativo/article/list'))
    .catch(err => console.log(err))
})

module.exports = router