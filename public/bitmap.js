function Bitmap(width, height) {
    this.grid = [];
    this.history = [];
    for(var row = 0; row < height; row++) {
        var row_arr = new Array(width);
        row_arr.fill("white");
        this.grid.push(row_arr);
    }
}

Bitmap.prototype.render = function(target_element) {
    this.cells = [];
    for(var row = 0; row < this.grid.length; row++) {
        var row_div = document.createElement("div");
        var cell_refs = [];
        row_div.className = "bmp_row";
        for(var col = 0; col < this.grid[row].length; col++) {
            var cell = document.createElement("div");
            cell.className = "bmp_cell";
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.style.background = this.grid[row][col];
            cell.addEventListener("click", this);
            row_div.appendChild(cell);
            cell_refs.push(cell);
        }
        target_element.appendChild(row_div);
        this.cells.push(cell_refs);
    }
};

Bitmap.prototype.setColor = function(row, col, color) {
    this.grid[row][col] = color;
    this.cells[row][col].style.background = color;
}

Bitmap.prototype.setRecord = function( row, col, color, method ) {
    console.log( 'From SetRecord: ',  row, col, color, method  )
    this.history.push( {
        tool: method,
        row: row,
        col: col,
        color: color,
        time: Date.now()
    } )
}

Bitmap.prototype.handleEvent = function(event) {
    if(event.type === "click") {
        var row = parseInt(event.currentTarget.dataset.row);
        var col = parseInt(event.currentTarget.dataset.col);
        if(tool === "draw") {
            this.setColor(row, col, paint_color);
            this.setRecord(row, col, paint_color, 'DRAW' )
        } else if(tool == "fill") {
            this.fill(row, col, paint_color);
            this.setRecord(row, col, paint_color, 'FILL' )
        }
    }
}


Bitmap.prototype.getRecord = function() {
    let value = this.history
    this.history = []
    return value
}

Bitmap.prototype.loadTime = Date.now()

Bitmap.prototype.update = function( url = '/updates' ) {
    let head = new Headers()
    head.append( 'Content-Type', 'application/json' )

    let rec = this.getRecord()
    let req = new Request( url, {
        method: 'POST',
        headers: head,
        body: JSON.stringify({
            'lastUpdate': this.loadTime,
            'clientUpdates': rec,
        })
    })

    this.loadTime = Date.now()

    fetch(req).then( (res) => {
            return res.json()
    } ).then( ( json ) => {
        console.log( json )
            if ( json.data && json.data.length > 0 ) {
                for ( let action of json.data ) {
                    console.log( action )
                    if( action.tool === 'DRAW' ) {
                        this.setColor( action.row, action.col, action.color )
                    } else if( action.tool === 'FILL' ) {
                        this.fill( action.row, action.col, action.color )
                    }
                }
            }
            if ( json.timestamp )  this.loadTime = json.timestamp
        } ).catch( ( err ) => {
            console.log( err )
            errCount += 1
        } )
}
