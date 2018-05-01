// enchantjsのライブラリを使用する宣言
enchant();

// グローバル変数
var SPRITE_WIDTH = 20;
var SPRITE_HEIGHT = 20;

// windowの読み込み完了時に
window.onload = function(){
	// Gameオブジェクトの宣言
	var game = new Game(400 , 500);  				//画面サイズを400*500にする。（このサイズだとスマホでも快適なのでおススメ）

	// 開始時に必要な要素をここでpreloadする

	// 今回は円や四角などを描画してシーンに追加する
	// 図の描画のためにSurfaceオブジェクトを作成する
	// SurfaceにはHTML5のCanvasのメソッドが使える

	// surfaceを作成してそれをspriteオブジェクトに入れる
	// ここで入れる値はオブジェクトの値になる。表示される大きさはまた別
	var sprite = new Sprite(SPRITE_WIDTH , SPRITE_HEIGHT); // スプライト生成
	var surface = new Surface(SPRITE_WIDTH , SPRITE_HEIGHT); // サーフェス生成

	// canvas 描画
	surface.context.fillStyle = "white";
	// 四角の描画 x始点,y始点,x長さ,y長さ
	surface.context.fillRect(0,0,20,20);
	surface.context.fillStyle = "green";
	surface.context.fillRect(5,5,10,10);

	// 作ったサーフェスを画像としてスプライトにセット
	// これはおまじないとして覚えておいて良さそう
	sprite.image = surface;

	game.onload = function(){
		// rootScene デフォルトで設定されるシーン
		var scene = game.rootScene;
		scene.backgroundColor = "black";
		// シーンに追加
		scene.addChild(sprite);
	};

	game.onenterframe = function(){
		if(sprite.x < 400){
			sprite.x += 10;
			sprite.y=100+Math.sin(sprite.x/40)*100;
		} else {
			sprite.x = -20;
		}
	};

	// おまじない。これがないと起動しない
	game.start();
}
