// enchantjsのライブラリを使用する宣言
enchant();

// グローバル変数
// ゲーム画面
var GAME_WIDTH = 400;
var GAME_HEIGHT = 500;
// ブロックの大きさの設定
var DIVIDE_X = 5; // ブロックのX方向の分割数
var DIVIDE_Y = 4;
var DIVISION_X = GAME_WIDTH / DIVIDE_X; // X軸方向に分割したときの幅
var DIVISION_Y = 30; // Y軸方向に分割したときの幅

var BLOCK_SPACE_PER = 5; // ブロック毎に空ける隙間 %
var BLOCK_SPACE = DIVISION_X * ( BLOCK_SPACE_PER / 100 ); // ブロック毎に空ける隙間 px

var BLOCK_WIDTH = DIVISION_X - BLOCK_SPACE;
var BLOCK_HEIGHT = DIVISION_Y - BLOCK_SPACE;

var BALL_WIDTH = 20;
var BALL_HEIGHT = 20;

// バーは半円を半円で切り抜いた三日月の形
var BAR_RADIUS = 20;
var BAR_WIDTH = BAR_RADIUS * 2;
var BAR_HEIGHT = BAR_RADIUS;

var SHOOTER_DIVIDE = 5;
var SHOOTER_DIVISION_X = GAME_WIDTH / SHOOTER_DIVIDE;
var SHOOTER_DIVISION_Y = 40;
var SHOOTER_WIDTH = SHOOTER_DIVISION_X - BLOCK_SPACE;
var SHOOTER_HEIGHT = SHOOTER_DIVISION_Y - BLOCK_SPACE;

var DEADLINE_POSITION = 420;
var DEADLINE_HEIGHT = 10;

// windowの読み込み完了時に
window.onload = function(){
	// Gameオブジェクトの宣言
	var game = new Game(GAME_WIDTH , GAME_HEIGHT);  				//画面サイズを400*500にする。（このサイズだとスマホでも快適なのでおススメ）

	// 開始時に必要な要素をここでpreloadする

	// 今回は円や四角などを描画してシーンに追加する
	// 図の描画のためにSurfaceオブジェクトを作成する
	// SurfaceにはHTML5のCanvasのメソッドが使える

	// surfaceを作成してそれをblockオブジェクトに入れる
	// ここで入れる値はオブジェクトの値になる。表示される大きさはまた別
	// var block = new Sprite(BLOCK_WIDTH , BLOCK_HEIGHT); // スプライト生成
	var surface = new Surface(BLOCK_WIDTH , BLOCK_HEIGHT); // サーフェス生成

	// canvas 描画
	surface.context.fillStyle = "white";
	// 四角の描画 x始点,y始点,x長さ,y長さ
	surface.context.fillRect(0,0,BLOCK_WIDTH , BLOCK_HEIGHT);
	// surface.context.fillStyle = "green";
	// surface.context.fillRect(5,5,10,10);

	// 作ったサーフェスを画像としてスプライトにセット
	// これはおまじないとして覚えておいて良さそう
	// block.image = surface;
	// canvasの描画はonload内で使ったサンプルが検索でよく出るけど、
	// ここでプレロード的に使ってもちゃんと動く

	// ブロックのスプライトオブジェクトを複数生成する
	// グループ化オブジェクトを使ってみる
	var blockGroup = new Group();

	for(var y = 0; y < DIVIDE_Y; y++){
		for( var x = 0; x < DIVIDE_X; x++){
			var block = new Sprite(BLOCK_WIDTH , BLOCK_HEIGHT);
			// イメージとして読み込む
			block.image = surface;
			var posX = (DIVISION_X * x) + (BLOCK_SPACE / 2);
			var posY = (DIVISION_Y * y) + (BLOCK_SPACE / 2);
			block.x = posX;
			block.y = posY;
			// ブロックのグループに追加
			blockGroup.addChild(block);
		}
	}

	// ブロックを壊すボールの描画
	var ball = new Sprite(BALL_WIDTH,BALL_HEIGHT);
	// 円塗りつぶし描画
	var surface = new Surface(BALL_WIDTH , BALL_HEIGHT); // サーフェス生成
	surface.context.beginPath();
	surface.context.arc(10, 10, 10, 0, Math.PI*2, false);
	surface.context.fillStyle = "yellow";
	surface.context.fill();

	ball.image = surface;
	ball.x = GAME_WIDTH / 2 - BALL_WIDTH / 2;
	ball.y = GAME_HEIGHT / 2;


	// ボールを打ち返すバーの描画
	var surface = new Surface(BAR_WIDTH,BAR_HEIGHT);
	surface.context.beginPath();
	surface.context.arc(BAR_WIDTH / 2,BAR_HEIGHT,BAR_RADIUS,Math.PI,Math.PI * 2,false);
	surface.context.fillStyle = "red";
	surface.context.fill();

	surface.context.beginPath();
	surface.context.arc(BAR_WIDTH / 2,BAR_HEIGHT * 3 / 2 ,BAR_RADIUS,Math.PI,Math.PI * 2,false);
	surface.context.fillStyle = "black";
	surface.context.fill();

	var barGroup = new Group();
	for(var x = 0; x < SHOOTER_DIVIDE; x++){
		var bar = new Sprite(BAR_WIDTH,BAR_HEIGHT);
		bar.image = surface;
		posX = (SHOOTER_DIVISION_X * (x+1)) - SHOOTER_DIVISION_X/2 - BAR_WIDTH/2;
		posY = GAME_HEIGHT - SHOOTER_DIVISION_Y - BAR_HEIGHT - (BLOCK_SPACE / 2);

		bar.x = posX;
		bar.y = posY;
		barGroup.addChild(bar);
	}

	// バーを打ち出すシューターの描画
	var surface = new Surface(SHOOTER_WIDTH,SHOOTER_HEIGHT);
	surface.context.fillStyle = "pink";
	surface.context.fillRect(0,0,SHOOTER_WIDTH,SHOOTER_HEIGHT);

	// シューターグループ
	var shooterGroup = new Group();
	for(var x = 0; x < SHOOTER_DIVIDE; x++){
		var shooter = new Sprite(SHOOTER_WIDTH,SHOOTER_HEIGHT);
		shooter.image = surface;
		posX = (SHOOTER_DIVISION_X * x) + (BLOCK_SPACE / 2);
		posY = GAME_HEIGHT - SHOOTER_DIVISION_Y + (BLOCK_SPACE / 2);
		// var posY = GAME_HEIGHT;
		shooter.x = posX;
		shooter.y = posY;

		// ブロックのグループに追加
		shooterGroup.addChild(shooter);
	}

	// デッドラインの描画
	var surface = new Surface(GAME_WIDTH,DEADLINE_HEIGHT);
	var deadline = new Sprite(GAME_WIDTH,DEADLINE_HEIGHT);
	surface.context.fillStyle = "blue"
	surface.context.fillRect(0,0,GAME_WIDTH,DEADLINE_HEIGHT);
	deadline.image = surface;
	deadline.y = DEADLINE_POSITION;

	game.onload = function(){
		// rootScene デフォルトで設定されるシーン
		var scene = game.rootScene;
		scene.backgroundColor = "black";

		scene.addChild(blockGroup);

		scene.addChild(ball);
		// scene.addChild(barGroup);
		scene.addChild(barGroup)
		// scene.addChild(bars[][0]);

		// scene.addChild(shooterGroup);
		scene.addChild(shooterGroup);
		// このやり方だとグループ全体として読まれ、結果はどれを押しても0だった
		// shooterGroup.addEventListener('ontouchstart',function(){
		// 	console.log(this.x);
		// });
		scene.addChild(deadline);

		var ballDirection_X = 1;
		var ballSpeed_X = 5;
		var ballDirection_Y = -1;
		var ballSpeed_Y = 5;
		var barSpeed = 15;
		// console.log(barGroup.childNodes[0].y);
		var barDefault = barGroup.childNodes[0].y;
		var barShot = new Array(SHOOTER_DIVIDE);
		for (var i = 0; i < barShot.length; i++) {
			barShot[i] = 0;
		};
		// グループの要素それぞれにアクセスするにはchildNodesを使ってforEach
		// インデックスを利用するにはfunction内に複数書く
		// a.forEach(function(val,index,ar){  ⇦ 第一引数が値、第二引数がインデックス、第三引数にforEachされている配列
		shooterGroup.childNodes.forEach(function(shooter,index){
			shooter.addEventListener("enterframe",function(){
				shooter.ontouchstart=function(){
					// shooter.y -= BLOCK_SPACE * 2;
					barShot[index] = 1;
				};
				// shooter.ontouchend=function(){
				// 	shooter.y += BLOCK_SPACE * 2;
				// };
			});
		});

		barGroup.childNodes.forEach(function(bar,index,bars){
			bar.addEventListener("enterframe",function(){
				bars[index].y -= barSpeed * barShot[index];
				// シューターに当たると射出→スマホの時不具合があるので廃止
				// if(bar.intersect(shooterGroup.childNodes[index])){
				// 	// console.log(bars[index]);
				// 	barShot[index] = 1;
				// };

				if(bars[index].y <= 0){
					barShot[index] = 0;
					bars[index].y = barDefault;
				};
				if(bars[index].intersect(ball)){
					barShot[index] = 0;
					bars[index].y = barDefault;
					ballDirection_Y *= -1;
				};
			});
		});

		// グループの要素それぞれにアクセスするにはchildNodesを使ってforEach
		blockGroup.childNodes.forEach(function(block){
			block.addEventListener("enterframe",function(){

				// ボールとの当たり判定
				if(block.intersect(ball)){
					blockGroup.removeChild(block);
					console.log(blockGroup.childNodes.length);
					// ブロックが全て消えたとき
					if(blockGroup.childNodes.length == 0){
						game.popScene(); // デフォルトシーンを外す
						game.pushScene(SCENE_CLEAR); // シーンをクリア画面に
					};
					var deltaX = ball.x - (ballDirection_X * ballSpeed_X);
					var deltaY = ball.y - (ballDirection_Y * ballSpeed_Y);
					if(deltaX + BALL_WIDTH < block.x || deltaX > block.x + BLOCK_WIDTH){
						ballDirection_X *= -1;
					};
					if(deltaY + BALL_HEIGHT < block.y || deltaY > block.y + BLOCK_HEIGHT){
						ballDirection_Y *= -1;
					};
				};
			});
		});

		//ゲーム終了時の表示文字
		var GameOverText=new Label(); 					//テキストはLabelクラス
		GameOverText.font = "20px Meiryo";				//フォントはメイリオ 20px 変えたかったらググってくれ
		GameOverText.color = 'rgba(255,255,255,1)';		//色　RGB+透明度　今回は白
		GameOverText.width=400;							//横幅指定　今回画面サイズ400pxなので、width:400pxだと折り返して二行目表示してくれる
		GameOverText.moveTo(0,30);						//移動位置指定

		//クリア画面
		SCENE_CLEAR = new Scene();
		SCENE_CLEAR.backgroundColor="black";
		GameOverText.text="Game Clear!";
		SCENE_CLEAR.addChild(GameOverText);						//シーンにこの画像を埋め込む

		// ミス画面
		SCENE_MISS = new Scene();
		SCENE_MISS.backgroundColor="blue"
		GameOverText.text="You Missed!"
		SCENE_MISS.addChild(GameOverText);

		// 常に動いてるボールの制御
		game.onenterframe = function(){
			ball.x += ballDirection_X * ballSpeed_X;
			ball.y += ballDirection_Y * ballSpeed_Y;
			// 壁との当たり判定
			if(ball.x == GAME_WIDTH - BALL_WIDTH){
				ballDirection_X = -1;
			};
			if(ball.x == 0){
				ballDirection_X = 1;
			};
			if(ball.y == 0){
				ballDirection_Y = 1;
			};
			// デッドラインと接触
			if(ball.y == DEADLINE_POSITION - BALL_HEIGHT){
				// ballDirection_Y = -1;
				game.popScene();
				game.pushScene(SCENE_MISS);
			};

		};

	};
	// おまじない。これがないと起動しない
	game.start();
}
