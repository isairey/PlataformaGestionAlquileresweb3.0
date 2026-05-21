const express = require('express')
const router = express.Router()
const Contract = require('../models/Contract')
const Article = require('../models/Article')
const Event = require('../models/Event')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


// Get 
router.get('/manager/event/:idEvent', (req, res) => {
    let idEvent = req.params.idEvent

    Contract.findAll({
        where: {
            event_id: idEvent,
            user_id: req.user.id
        },
        include:[
            {
                model: Event
            },
            {
                model: Article,
            }
        ]
        
    })
    .then((contracts) => {
        res.send(contracts);
    })
    .catch((err)=> console.log("Erro get contract+article", err))
})

// Get value dataEvent
router.get('/event/:idEvent', (req, res) => {
    let idEvent = req.params.idEvent
    let termSearch = req.query.term

    let query = '%' + termSearch + '%'
               
    Event.findByPk(idEvent)
    .then((event) => {

        if(event === null || event.user_id != req.user.id)
        {
            res.redirect('/notfound');
        }else
        {
            // Give back Search if term
            if(!termSearch)
            {
                res.render('eventManager', {event});
            }
            else{
                Article.findAll({
                    where: {
                        description: {[Op.like]: query},
                        user_id: req.user.id
                    }
                })
                .then((resultSearch) => {
                    res.render('eventManager', {event,termSearch, resultSearch});
                })
                .catch((err) => console.log("Error search Article"))
            }
        }
    })
    .catch((err) => console.log("Erro get Event for Manager contract"))

})


// Delete Contract
router.post('/article/delete/', (req, res) => {
    
    let idEvent = req.body.idEvent;    
    let idArticle = req.body.idArticle;
    let user_id = req.user.id;
    
    Contract.destroy({
        where: {event_id: idEvent, article_id: idArticle, user_id: user_id}
    })
    .then(() => res.redirect('/aplicativo/contract/event/'+idEvent))
    .catch(err => console.log('Delete erro' + err))
})

// Add Contract
router.post('/article/add/', (req, res) => {
    let idEvent = req.body.idEvent
    let idArticle = req.body.idArticle
    let valueContract = req.body.valueContract
    let user_id = req.user.id

    // Insert
    Contract.create({
        user_id: user_id,
        event_id: idEvent,
        article_id: idArticle,
        value: valueContract
    })
    .then(() => res.redirect('/aplicativo/contract/event/'+idEvent))
    .catch(err => console.log('Erro add Contract: ' + err))
})
module.exports = router