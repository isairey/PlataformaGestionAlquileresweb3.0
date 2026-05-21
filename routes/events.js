const express   = require('express')
const router    = express.Router()
const Event     = require('../models/Event')

// Get on element
router.get('/detail/:id', (req, res) => {
    let idEvent = req.params.id;

    Event.findAll({
        where: {
            id: idEvent,
            user_id: req.user.id
        },
    })
    .then(event => {
        res.send(event)
    })
    .catch(err => console.log('Not possible recure elemente' + err))

})

// Delete Event
router.post('/delete', (req, res) => {
    
    let idEvent = req.body.id;
    
    Event.destroy({
        where: {
            id: idEvent,
            user_id: req.user.id
        }
    })
    .then(() => res.send(true))
    .catch(err => console.log('Delete erro' + err))
})

// Update Event
router.post('/update', (req, res) => {
    let {id, date, address, client} = req.body;

    Event.findByPk(id)
    .then((event) => {
        event.date = date
        event.address = address
        event.client = client
        if(event.user_id == req.user.id)
        return event.save()
    })
    .then(() => res.send(true))
    .catch(err => console.log('Update erro' + err))
})

//List Event
router.get('/list', (req, res) => {
    Event.findAll({
        where: {user_id: req.user.id},
        order: [
        ['id', 'DESC']
    ]})
    .then(events => {
        res.render('eventList', {events})
    })
    .catch(err => console.log('Erro list Events' + err))
})

// form add event
router.get('/add', (req, res) => {
    res.render('eventAdd')
})

// Add Event
router.post('/add', (req, res) => {
    let {date, address, client} = req.body
    let user_id = req.user.id;

    // Insert
    Event.create({
        user_id,
        date,
        address,
        client
    })
    .then(() => res.redirect('/aplicativo/event/list'))
    .catch(err => console.log('Add fail Events: ' + err))
})

module.exports = router