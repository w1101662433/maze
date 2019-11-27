player_class = function (site=[0,0], color = 'red') {
    this.site = site;
    this.color = color;
    this.move = function (side) {
        [x, y] = this.site;
        switch (side) {
            case 'left':
                this.site = [x - 1, y];
                break;
            case 'right':
                this.site = [x + 1, y];
                break;
            case 'top':
                this.site = [x, y - 1];
                break;
            case 'bottom':
                this.site = [x, y + 1];
                break;
        }
        console.log(this.site)
    }
};

function generate_player(){
    return new player_class();
}




