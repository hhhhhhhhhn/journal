const readline = require('readline');
readline.emitKeypressEvents(process.stdin)
process.stdin.setRawMode(true)

class TextEdit{
    constructor(){
        this.writing = true
        this.text = ""
		this.cursor = 0
		console.clear()      
    }

    stringToGridCoordenates(text, coord){
        var [x, y] = [0, 0]
        for(var char of text.slice(0, coord)){
            if(x < process.stdout.columns && char != "\n"){
                x ++
            }
            else{
                y ++
                x = 0
            }
        }
        return [x, y]
    }

    gridToStringCoordenates(text, xCoord, yCoord){
        var [x, y] = [0, 0]
        var coord = 0
        for(var char of text){
            if(y >= yCoord && (char == "\n" || x == process.stdout.columns)) return coord
            else if(y >= yCoord && x >= xCoord) return coord
            else if(x < process.stdout.columns && char != "\n") x++
            else{
                y ++
                x = 0
            }
            coord ++
        }
        return coord
    }

    render(){
        var [x, y] = this.stringToGridCoordenates(this.text, this.cursor)
        console.clear()
        process.stdout.write(this.text)
        var [xMax, yMax] = this.stringToGridCoordenates(this.text, this.text.length)
        readline.moveCursor(process.stdout, x - xMax, y - yMax)
    }

    updateCursor(dx, dy){
        var [x, y] = this.stringToGridCoordenates(this.text, this.cursor)
        if(x + dx < 0){
            dx = Infinity
            dy = -1
        }
        var oldCursor = this.cursor
        this.cursor = this.gridToStringCoordenates(this.text, x + dx, y + dy)
        if(this.cursor == oldCursor){                                           // When moving to the right in last char
            this.cursor = this.gridToStringCoordenates(this.text, 0, y + 1)
        }
        var [newX, newY] = this.stringToGridCoordenates(this.text, this.cursor) //Changes to nearest existing character.
        readline.moveCursor(process.stdout, newX - x, newY - y)
    }

    async getText(del  = true){
        process.stdin.on("keypress", async (str, key) => {
            if(key.name == "c" && key.ctrl) process.exit()
            else if(key.name == "x" && key.ctrl){
                if(del) console.clear()
                this.resolve(this.text)
                process.stdin.removeAllListeners("keypress")
            }
            else if(key.name == "up") this.updateCursor(0, -1)
            else if(key.name == "down") this.updateCursor(0, 1)
            else if(key.name == "left") this.updateCursor(-1, 0)
            else if(key.name == "right") this.updateCursor(1, 0)
    
            else if(["\n", "\r"].includes(key.sequence)){
                this.text = this.text.slice(0, this.cursor) + "\n" + this.text.slice(this.cursor)
                this.render()
                this.updateCursor(0, 1)
            }
            else if(key.sequence == "\b"){
                if(this.cursor != 0){
                    this.updateCursor(-1, 0)
                    this.text = this.text.slice(0, this.cursor) + this.text.slice(this.cursor + 1)
                    this.render()
                }
            }
            else{
                if(str != undefined){
                    this.text = this.text.slice(0,this.cursor) + str + this.text.slice(this.cursor)
                    this.updateCursor(1, 0)
                    this.render()
                }
            }
        })
        return new Promise((resolve, reject)=>{
            this.resolve = resolve
            this.reject = reject
        })
    }
}

async function getText(del = true){
    var edit = new TextEdit()
    return edit.getText(del) 
}

module.exports = getText