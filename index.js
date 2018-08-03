const PORT = 3000
const mongodb = 'mongodb://localhost:27017/kgdata'

const express = require("express")
const app = express()

const mongoose = require('mongoose')
mongoose.connect( mongodb, { useNewUrlParser: true } )

const Update = require('./models/Updates.js')

app.use( express.urlencoded( { extended: true } ) )
app.use( express.static('public') )
app.use( express.json() )

// Fill in your request handlers here

// get update from client
app.post( '/getUpdate', ( req, res ) => {
    if ( req.body ) {
        console.log( req.body )    }
} )

// receive added cells from server.
app.post( '/updates', ( req, res ) => {
    console.log( 'req moves', req.body )
    if ( req.body.clientUpdates && req.body.clientUpdates.length > 0 ) {
        req.body.clientUpdates.forEach( ( a ) => {

            let update = new Update( {
                row: a.row,
                col: a.col,
                color: a.color,
                time: a.time,
                tool: a.tool
            } )

            update.save()
        } )
    }

    console.log( 'time:',req.body.lastUpdate )

    Update.find( { time: { $gte: new Date( req.body.lastUpdate ) } } ).exec( ( err, found ) => {
        let data

        if ( err ) {
            data = err
        } else {
            data = found
        }
        console.log( 'data', data )
        res.json( { data: data, timestamp: Date.now() } )

    } )

    // request.body will hold the text fields, if there were any
    // if ( req.body.clientUpdates )
    //     updates.push( ...req.body.clientUpdates )
    // res.send( updates )
    // if callback call on res


} )

app.listen( PORT )