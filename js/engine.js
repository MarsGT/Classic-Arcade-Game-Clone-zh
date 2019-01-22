/*
 * Engine.js
 * 该文件用于提供游戏引擎，包括画出游戏界面以及调用 Update/render 函数（在app.js中定义）
 * 游戏引擎通过 Engine 变量提供对外访问，并且提供了全局的 Canvas 上下文供公开访问。
 */

var Engine = (function(global) {
    // 定义一些变量，并创建全局 Canvas 上下文
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    // 游戏主循环
    function main() {
        // 获取时间间隔，用于更新每帧动画
        var now = Date.now(),
            dt = (now - lastTime) / 1000;

        update(dt);
        render();

        // 决定下次被调用的时间
        lastTime = now;

        // 调用浏览器原生的 requestAnimationFrame 接口执行主循环
        win.requestAnimationFrame(main);
    }

    // 游戏初始化
    function init() {
        lastTime = Date.now();
        main();
    }

    // 全局数据更新，被游戏主循环调用
    function update(dt) {
        // 判断是否胜利
        var isWin = player.isWin();
        if (isWin) {
            alert('You WIN!');
            reset();
        }

        updateEntities(dt);
    }

    // 实例数据更新，用于分别更新敌人以及玩家对象的相关数据
    // 其应聚焦于更新相关的对象 / 属性，而后将重绘交给独立的重绘逻辑
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update();
    }

    // 全局重绘。清画布，绘制游戏底图，最后调用 renderEntities()
    function render() {
        var rowImages = [
                'images/water-block.png',
                'images/stone-block.png',
                'images/stone-block.png',
                'images/stone-block.png',
                'images/grass-block.png',
                'images/grass-block.png'
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        // 绘制前需要清空原有画布
        ctx.clearRect(0,0,canvas.width,canvas.height);

        // 绘制底图
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        renderEntities();
    }

    // 实例重绘逻辑，用于分别调用敌人以及玩家对象的重绘方法
    function renderEntities() {
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();
    }

    // 游戏重置逻辑
    function reset() {
        allEnemies.forEach(function (enemy) {
            enemy.reset();
        });

        player.reset();
    }

    // 游戏资源预加载（主要是图片），加载完成后将调用初始化逻辑
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png',
        'images/grass-block.png',
        'images/stone-block.png',
        'images/water-block.png'
    ]);
    Resources.onReady(init);

    // 把 canvas 上下文绑定到全局变量，以方便app.js中的调用
    global.ctx = ctx;
})(this);
