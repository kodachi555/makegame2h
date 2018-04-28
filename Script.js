enchant();

window.onload=function() {
	var game = new Game(400,500);  				//画面サイズを400*500にする。（このサイズだとスマホでも快適なのでおススメ）
	
	//結果ツイート時にURLを貼るため、このゲームのURLをここに記入
	var url="https://twitter.com/hothukurou";
	url= encodeURI(url); //きちんとURLがツイート画面に反映されるようにエンコードする
	/////////////////////////////////////////////////
	//ゲーム開始前に必要な画像・音を読み込む部分
	
	
	//コイン音読み込み
	var M_Coin="Coin.wav";						//game.htmlからの相対パス
		game.preload([M_Coin]); 				//データを読み込んでおく
		
	//コイン画像
	var B_Coin="Coin.png";						//game.htmlからの相対パス
		game.preload([B_Coin]);					//データを読み込んでおく
	
	//リトライボタン
	var B_Retry="Retry.png";						//game.htmlからの相対パス
		game.preload([B_Retry]);					//データを読み込んでおく

	//ツイートボタン
	var B_Tweet="Tweet.png";						//game.htmlからの相対パス
		game.preload([B_Tweet]);					//データを読み込んでおく		
	
	//読み込み終わり
	/////////////////////////////////////////////////
	
	
	game.onload = function() {					//ロードが終わった後にこの関数が呼び出されるので、この関数内にゲームのプログラムを書こう
		
		/////////////////////////////////////////////////
		//グローバル変数 
		
		var Coin=0;									//コイン枚数
		var State=0;								//現在のゲーム状態
		
		//グローバル変数終わり
		/////////////////////////////////////////////////
		
		
		
		var S_MAIN = new Scene();					//シーン作成
		game.pushScene(S_MAIN);  					//S_MAINシーンオブジェクトを画面に設置
		S_MAIN.backgroundColor = "black"; 			//S_MAINシーンの背景は黒くした

		//コイン枚数表示テキスト
		var S_Text=new Label(); 					//テキストはLabelクラス
		S_Text.font = "20px Meiryo";				//フォントはメイリオ 20px 変えたかったらググってくれ
		S_Text.color = 'rgba(255,255,255,1)';		//色　RGB+透明度　今回は白
		S_Text.width=400;							//横幅指定　今回画面サイズ400pxなので、width:400pxだと折り返して二行目表示してくれる
		S_Text.moveTo(0,30);						//移動位置指定
		S_MAIN.addChild(S_Text);					//S_MAINシーンにこの画像を埋め込む
		
		S_Text.text="現在："+Coin;					//テキストに文字表示 Coinは変数なので、ここの数字が増える
		
		//コインボタン
		var S_Coin=new Sprite(166,168);				//画像サイズをここに書く。使う予定の画像サイズはプロパティで見ておくこと
		S_Coin.moveTo(118,100);						//コインボタンの位置
		S_Coin.image = game.assets[B_Coin];			//読み込む画像の相対パスを指定。　事前にgame.preloadしてないと呼び出せない
		S_MAIN.addChild(S_Coin);					//S_MAINにこのコイン画像を貼り付ける  
		
		S_Coin.ontouchend=function(){				//S_Coinボタンをタッチした（タッチして離した）時にこの中の内容を実行する
			Coin++;									//コイン枚数を1増やす
			game.assets[M_Coin].clone().play();		//コインの音を鳴らす。
			
			//クリックしたのでコイン画像のｘ位置を戻す
			this.x=-200;							//this.xって何？と思った方、S_Coinの関数内でS_Coinの座標を動かすときにはthisを使います。
			
			//コイン枚数によって状態Stateを変更する
			if(Coin<3){
				State=1;
			}else if(Coin<6){
				State=2;
			}else if(Coin<9){
				State=3;
			}else if(Coin<12){
				State=4;
			}else{
				State=5;
			}
			
		};
				

		
		///////////////////////////////////////////////////
		//メインループ　ここに主要な処理をまとめて書こう
		game.onenterframe=function(){
			if(State==0){ 							//State=0のとき、初期セット状態(コインの状態を０にして)
				S_Coin.x=-200;						//コインのｘ座標を指定
				S_Coin.y=100;						//コインのy座標を指定
				Coin=0;  							//コイン枚数初期化
				State=1;							//ゲームスタート状態に移行
			}
			if(State==1){							//ゲームスタート　状態１
				S_Coin.x+=5;
			}
			if(State==2){							//状態２（コイン３枚以上から）
				S_Coin.x+=15;
			}
			if(State==3){							//状態３（コイン６枚以上から）
				S_Coin.x+=10;							
				S_Coin.y=200+Math.sin(S_Coin.x/70)*100; // ｙ座標を振幅100pxのサイン波で移動(Sinは便利なので慣れとくといいよ！)
			}
			if(State==4){							//状態４（コイン９枚以上から）　4は初期セット状態（State=4）と移動状態（State=4.1)の2つに状態をわける		
				S_Coin.y=Math.random()*400;			//ｙ座標の位置をランダムに決定
				State=4.1;							
			}
			if(State==4.1){							//状態４．１ 移動状態
				S_Coin.x+=10;						//ただ移動します
			}
			if(State==5){							//状態５（コイン１２枚以上から）　 ｙ軸が毎フレーム毎に変化する
				S_Coin.x+=20;						//移動します。
				S_Coin.y=Math.random()*400;			//ｙ座標の位置を枚フレーム毎にランダム決定
			}			
			
			//現在のテキスト表示
			S_Text.text="現在："+Coin; 				//Coin変数が変化するので、毎フレームごとにCoinの値を読み込んだ文章を表示する
			
			//ゲームオーバー判定
			if(S_Coin.x>=400){						//画面端にコイン画像が行ってしまったら
				game.popScene();					//S_MAINシーンを外す
				game.pushScene(S_END);				//S_ENDシーンを読み込ませる
				
				//ゲームオーバー後のテキスト表示
				S_GameOverText.text="GAMEOVER 記録："+Coin+"枚";				//テキストに文字表示 
			}
			
		};
		
		
		
		////////////////////////////////////////////////////////////////
		//結果画面
		 S_END=new Scene();
		 S_END.backgroundColor="blue";

		//GAMEOVER
		var S_GameOverText=new Label(); 					//テキストはLabelクラス
		S_GameOverText.font = "20px Meiryo";				//フォントはメイリオ 20px 変えたかったらググってくれ
		S_GameOverText.color = 'rgba(255,255,255,1)';		//色　RGB+透明度　今回は白
		S_GameOverText.width=400;							//横幅指定　今回画面サイズ400pxなので、width:400pxだと折り返して二行目表示してくれる
		S_GameOverText.moveTo(0,30);						//移動位置指定
		S_END.addChild(S_GameOverText);						//S_ENDシーンにこの画像を埋め込む
		
		
		
		//リトライボタン
		var S_Retry=new Sprite(120,60);				//画像サイズをここに書く。使う予定の画像サイズはプロパティで見ておくこと
		S_Retry.moveTo(50,300);						//コインボタンの位置
		S_Retry.image = game.assets[B_Retry];			//読み込む画像の相対パスを指定。　事前にgame.preloadしてないと呼び出せない
		S_END.addChild(S_Retry);					//S_MAINにこのコイン画像を貼り付ける  
		
		S_Retry.ontouchend=function(){				//S_Retryボタンをタッチした（タッチして離した）時にこの中の内容を実行する
			State=0;
			game.popScene();						//S_ENDシーンを外す
			game.pushScene(S_MAIN);					//S_MAINシーンを入れる
		};		

		//ツイートボタン
		var S_Tweet=new Sprite(120,60);				//画像サイズをここに書く。使う予定の画像サイズはプロパティで見ておくこと
		S_Tweet.moveTo(230,300);						//コインボタンの位置
		S_Tweet.image = game.assets[B_Tweet];			//読み込む画像の相対パスを指定。　事前にgame.preloadしてないと呼び出せない
		S_END.addChild(S_Tweet);					//S_MAINにこのコイン画像を貼り付ける  
		
		S_Tweet.ontouchend=function(){				//S_Tweetボタンをタッチした（タッチして離した）時にこの中の内容を実行する
			//ツイートＡＰＩに送信
			
			window.open("http://twitter.com/intent/tweet?text=頑張って"+Coin+"枚入手した&hashtags=ahoge&url="+url); //ハッシュタグにahogeタグ付くようにした。
		};			
		
	};
	game.start();
};