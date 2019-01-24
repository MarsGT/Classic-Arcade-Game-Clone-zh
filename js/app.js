'use strict';

// 计分对象，用于计算得分等
var Util = function (score, heart) {
    this.score = score; // 得分
    this.heart = heart; // 生命
}
// 绘制生命
Util.prototype.renderHeart = function () {
    ctx.drawImage(Resources.get('images/Heart.png'), TILE_WIDTH * 4, 0, 30, 50);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '24px Arial';
    ctx.fillText(' × ' + this.heart.toString(), TILE_WIDTH * 4 + 35, 34);
}
// 更新生命
Util.prototype.updateHeart = function (active) {
    if (active) {
        this.heart += 1;
    } else if (this.heart - 1 > 0) {
        this.heart -= 1;
    }
}
// 绘制得分
Util.prototype.renderScore = function () {
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '24px Arial';
    ctx.fillText('得分：' + this.score.toString(), 20, 34);
}
// 更新得分
Util.prototype.updateScore = function (active) {
    if (active) {
        this.score += 10;
    } else if (this.score - 10 > 0) {
        this.score -= 10;
    }
    // 分数奖励
    if (this.score == 100) {
        this.heart += 1;
        this.score = 0;
    }
}
// 绘制顶栏
Util.prototype.renderBanner = function () {
    ctx.fillStyle = '#5FC148';
    ctx.fillRect(0, 0, 505, 50);
    this.renderScore();
    this.renderHeart();
}
// 重置逻辑
Util.prototype.reset = function () {
    this.score = 0;
    this.heart = 3;
}

// 每网格的宽与高
var TILE_WIDTH = 101,
    TILE_HEIGHT = 83;

// 敌人对象速度数组
var shuffle = function (arr) {
    var input = arr;
    for (var i = input.length - 1; i >= 0; i--) {
        var randomIndex = Math.floor(Math.random() * (i + 1));
        var itemAtIndex = input[randomIndex];
        input[randomIndex] = input[i];
        input[i] = itemAtIndex;
    }
    return input;
}
var speedArr = shuffle([3, 6, 9]);

// 敌人对象
var Enemy = function(x, y) {
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = speedArr.pop() * 25;
};
Enemy.prototype.update = function(dt) {
    this.x += this.speed * dt;
    this.checkCollisions();
    // 判断是否超出地图右边，超出则回到起始位置
    if (this.x > TILE_WIDTH * 5) {
        this.x = -TILE_WIDTH;
    }
};
Enemy.prototype.render = function () {
    // var rect = this.returnRect();
    // ctx.strokeStyle = 'red';
    // ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
// 返回敌人位置，用于碰撞检测
Enemy.prototype.returnRect = function () {
    return {
        x: this.x,
        y: this.y + 75,
        width: 101,
        height: 70
    }
}
Enemy.prototype.checkCollisions = function () {
    var enemyRect = this.returnRect();
    var playerRect = player.returnRect();
    var isColl =
        (enemyRect.x < playerRect.x + playerRect.width) &&
        (enemyRect.x + enemyRect.width > playerRect.x) &&
        (enemyRect.y < playerRect.y + playerRect.height) &&
        (enemyRect.y + enemyRect.height > playerRect.y);
    if (isColl) {
        util.updateHeart(false);
        player.reset();
    };
}
Enemy.prototype.reset = function () {
    this.x = -TILE_WIDTH;
}

// 玩家对象
var Player = function (x, y) {
    this.sprite = 'images/char-princess-girl.png';
    this.x = x;
    this.y = y;
}
Player.prototype.update = function () {
    // 判断是否超出地图范围
    if (this.x < 0) {
        this.x += TILE_WIDTH;
    } else if (this.x >= TILE_WIDTH * 5) {
        this.x -= TILE_WIDTH;
    } else if (this.y > 440) {
        this.y -= TILE_HEIGHT;
    }
}
Player.prototype.render = function () {
    // var rect = this.returnRect();
    // ctx.strokeStyle = 'blue';
    // ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}
// 返回玩家位置，用于碰撞检测
Player.prototype.returnRect = function () {
    return {
        x: this.x + 15,
        y: this.y + 75,
        width: 71,
        height: 70
    }
}
// 判断玩家是否到达河对岸
Player.prototype.isWin = function () {
    var point = this.returnRect();
    if (point.y < 120) {
        return true;
    } else {
        return false;
    }
}
Player.prototype.reset = function () {
    this.x = 202;
    this.y = 390;
}
// 选择玩家形象
Player.prototype.changePlayer = function (key) {
    switch (key) {
        case 'P1':
            this.sprite = 'images/char-boy.png';
            break;
        case 'P2':
            this.sprite = 'images/char-cat-girl.png';
            break;
        case 'P3':
            this.sprite = 'images/char-horn-girl.png';
            break;
        case 'P4':
            this.sprite = 'images/char-pink-girl.png';
            break;
        case 'P5':
            this.sprite = 'images/char-princess-girl.png';
            break;
    }
}
// 玩家移动
Player.prototype.movePlayer = function (key) {
    switch (key) {
        case 'left':
            this.x -= TILE_WIDTH;
            break;
        case 'up':
            this.y -= TILE_HEIGHT;
            break;
        case 'right':
            this.x += TILE_WIDTH;
            break;
        case 'down':
            this.y += TILE_HEIGHT;
            break;
    }
}

// 实例化对象
var allEnemies = new Array(3);
[0, 1, 2].forEach(function (i) {
    this[i] = new Enemy(-TILE_WIDTH, 58 + TILE_HEIGHT * i);
}, allEnemies);
var player = new Player(202, 390);
var util = new Util(0, 3);

// 监听用户按键事件
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.movePlayer(allowedKeys[e.keyCode]);
});
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        49: 'P1',
        50: 'P2',
        51: 'P3',
        52: 'P4',
        53: 'P5'
    };

    player.changePlayer(allowedKeys[e.keyCode]);
});
