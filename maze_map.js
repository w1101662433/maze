
const mazeWidth = 20;
const borderLength = 40;

border = function (site, side, border_length) {
    this.show = 1;
    this.len = border_length;
    switch (side) {
        case 'left':
            this.start_point = [site[0] * this.len, site[1] * this.len];
            this.end_point = [site[0] * this.len, (site[1] + 1) * this.len];
            break;
        case 'right':
            this.start_point = [(site[0] + 1) * this.len, site[1] * this.len];
            this.end_point = [(site[0] + 1) * this.len, (site[1] + 1) * this.len];
            break;
        case 'top':
            this.start_point = [site[0] * this.len, site[1] * this.len];
            this.end_point = [(site[0] + 1) * this.len, site[1] * this.len];
            break;
        case 'bottom':
            this.start_point = [site[0] * this.len, (site[1] + 1) * this.len];
            this.end_point = [(site[0] + 1) * this.len, (site[1] + 1) * this.len];
            break;
        default:
            console.log('default');
    }
};

block = function (site, border_length = borderLength) {
    this.site = site;
    this.connects = [this.site];
    this.border_length = border_length;
    this.left_border = new border(this.site, 'left', this.border_length);
    this.right_border = new border(this.site, 'right', this.border_length);
    this.top_border = new border(this.site, 'top', this.border_length);
    this.bottom_border = new border(this.site, 'bottom', this.border_length)
};

function init_maze_map(){
    let maze_map = Array();
    for (let i = 0; i < mazeWidth; i++) {
        maze_map[i] = Array();
        for (let j = 0; j < mazeWidth; j++) {
            maze_map[i][j] = new block([i, j]);
            if (i >= 1) {
                maze_map[i][j].left_border = maze_map[i - 1][j].right_border
            }
            if (j >= 1) {
                maze_map[i][j].top_border = maze_map[i][j - 1].bottom_border
            }
        }
    }
    return maze_map
}

function get_random_block(maze_map) {
    let x = Math.floor(Math.random() * mazeWidth);
    let y = Math.floor(Math.random() * mazeWidth);
    return maze_map[x][y]
}

function get_random_border(block) {
    let x = Math.floor(Math.random() * 4);
    let direction_dict = {
        0: block.left_border,
        1: block.right_border,
        2: block.top_border,
        3: block.bottom_border,
    };
    return direction_dict[x]
}

function find_array(outer, inner) {
    let is_in = false;
    for (let o in outer) {
        if (outer[o].toString() === inner.toString()) {
            is_in = true
        }
    }
    return is_in
}

function draw_arc(connects) {
    for (let con in connects) {
        [x, y] = connects[con];
        ctx.beginPath();
        ctx.arc((x+0.5)*borderLength,(y+0.5)*borderLength,borderLength/4,0,Math.PI*2,true);
        ctx.closePath();
        ctx.fill()
    }
}

function generate_maze() {
    let maze_map = init_maze_map();

    while (true) {
        let random_block = get_random_block(maze_map);
        let random_border = get_random_border(random_block);
        let neighbor;
        [x, y] = random_block.site;

        switch (random_border) {
            case random_block.left_border:
                if (x <= 0) continue;
                neighbor = maze_map[x - 1][y];
                break;
            case random_block.right_border:
                if (x >= mazeWidth - 1) continue;
                neighbor = maze_map[x + 1][y];
                break;
            case random_block.top_border:
                if (y <= 0) continue;
                neighbor = maze_map[x][y - 1];
                break;
            case random_block.bottom_border:
                if (y >= mazeWidth - 1) continue;
                neighbor = maze_map[x][y + 1];
                break;
        }
        let is_in = find_array(random_block.connects, neighbor.site);
        if (!is_in) {
            connects = random_block.connects.concat(neighbor.connects);
            random_border.show = 0;
            for (let con in connects) {
                [x, y] = connects[con];
                maze_map[x][y].connects = connects;
            }
            if (find_array(connects, [0, 0]) && find_array(connects, [mazeWidth-1, mazeWidth-1])) {
                // draw_arc(connects); // 打开可以直观的看见联通的方格
                break;
            }
        }
    }
    return maze_map
}

