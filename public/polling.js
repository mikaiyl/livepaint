// Add logic to this script to poll server every second for updated pixels.

function handleErrors( res ) {
    if ( !res.ok ) {
            throw Error( res.statusText )
        }
    return res
}


