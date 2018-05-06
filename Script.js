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
var BAR_RADIUS = 10;
var BAR_WIDTH = BAR_RADIUS * 2;
var BAR_HEIGHT = BAR_RADIUS;

var SHOOTER_DIVIDE = 5;
var SHOOTER_DIVISION_X = GAME_WIDTH / SHOOTER_DIVIDE;
var SHOOTER_DIVISION_Y = 40;
var SHOOTER_WIDTH = SHOOTER_DIVISION_X - BLOCK_SPACE;
var SHOOTER_HEIGHT = SHOOTER_DIVISION_Y - BLOCK_SPACE;

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
	var bar = new Sprite(BAR_WIDTH,BAR_HEIGHT);
	var surface = new Surface(BAR_WIDTH,BAR_HEIGHT);
	surface.context.beginPath();
	surface.context.arc(BAR_WIDTH / 2,BAR_HEIGHT,BAR_RADIUS,Math.PI,Math.PI * 2,false);
	surface.context.fillStyle = "red";
	surface.context.fill();

	surface.context.beginPath();
	surface.context.arc(BAR_WIDTH / 2,BAR_HEIGHT * 3 / 2 ,BAR_RADIUS,Math.PI,Math.PI * 2,false);
	surface.context.fillStyle = "black";
	surface.context.fill();

	bar.image = surface;
	bar.x = GAME_WIDTH / 2 - BAR_WIDTH / 2;
	bar.y = GAME_HEIGHT - SHOOTER_DIVISION_Y - BAR_HEIGHT;
	// bar.y = 400;

	// バーを打ち出すシューターの描画
	var surface = new Surface(SHOOTER_WIDTH,SHOOTER_HEIGHT);
	surface.context.fillStyle = "pink";
	surface.context.fillRect(0,0,SHOOTER_WIDTH,SHOOTER_HEIGHT);

	// シューターグループ
	var shooterGroup = new Group();
	for(var x = 0; x < SHOOTER_DIVIDE; x++){
		var shooter = new Sprite(SHOOTER_WIDTH,SHOOTER_HEIGHT);
		// イメージとして読み込む
		shooter.image = surface;
		posX = (SHOOTER_DIVISION_X * x) + (BLOCK_SPACE / 2);
		posY = GAME_HEIGHT - SHOOTER_DIVISION_Y + (BLOCK_SPACE / 2);
		// var posY = GAME_HEIGHT;
		shooter.x = posX;
		shooter.y = posY;

		// ブロックのグループに追加
		shooterGroup.addChild(shooter);
	}

	game.onload = function(){
		// rootScene デフォルトで設定されるシーン
		var scene = game.rootScene;
		scene.backgroundColor = "black";

		scene.addChild(blockGroup);

		scene.addChild(ball);
		scene.addChild(bar);

		scene.addChild(shooterGroup);
		// このやり方だとグループ全体として読まれ、結果はどれを押しても0だった
		// shooterGroup.addEventListener('ontouchstart',function(){
		// 	console.log(this.x);
		// });

		// グループの要素それぞれにアクセスするにはchildNodesを使ってforEach
		shooterGroup.childNodes.forEach(function(shooter){
			shooter.ontouchstart=function(){
				// forEachを使ってなんとかテストログ出力できた
				console.log(this.x);
			};
		});

		state = 0;

		game.onenterframe = function(){
			// if(block.x < 400){
			// 	block.x += 3;
			// 	// sin関数を使ってY軸を移動。波を描いて進む
			// 	block.y=100+Math.sin(block.x/40)*100;
			// } else {
			// 	block.x = -20;
			// }
			// switch (state) {
			// 	case 0:
			// 		block.x = BLOCK_SPACE;
			// 		block.y = BLOCK_SPACE;
			// 		break;
			// 	default:
			// }
		};

	};
	// おまじない。これがないと起動しない
	game.start();
}
