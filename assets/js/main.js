import Face from "./objects/face.js";
import Pipe from "./objects/pipe.js";

window.onload = function() {
  let canv = document.getElementById("flappy");
  let context = canv.getContext("2d");
  //スタート画面
  start_screen(canv, context);
};

function start_screen(canv, context) {
  let back_image = new Image();
  back_image.onload = function() {
    context.drawImage(back_image, 0, 0, 300, 400);
    context.font = "15pt Arial";
    context.fillStyle = "white";
    context.textAlign = "center";
    context.fillText("Flappy Face", 150, 100);
    context.fillText("画面をクリックして開始!", 150, 130);
    context.fillText("操作方法: ", 150, 160);
    context.fillText("画面をクリックorキーボード", 150, 190);
  }
  back_image.src = "assets/image/toropical.jpg";
  document.addEventListener("click", _start_click);

  function _start_click(evt) {
    document.removeEventListener("click", _start_click);
    start_game(canv, context);
  }
}

function start_game(canv, context) {
  //変数群
  let timer;
  let face;
  let pipe;
  let pipes = [];
  let rest_lives = 5;
  let rest_lives_prev = rest_lives;
  let score_flag = 0;
  let score = 0;
  let speed_up_flag = 0;
  let frame_count = 0;
  let frame_state = 0;
  let frame_state_prev = frame_state;
  let frame_rate = 30;
  let happy_face = new Image();
  let back_image = new Image();

  //画像のパスを指定
  happy_face.src = "assets/image/nikori.png";
  back_image.src = "assets/image/toropical.jpg";

  //ゲーム開始の準備
  context.drawImage(back_image, 0, 0, 300, 400);
  face = new Face(canv.height, canv.width);
  pipe = new Pipe(canv.height, canv.width);
  pipes.push(pipe);

  //frame_rateごとに_proceed_gameを実行
  timer = setInterval(_proceed_game, frame_rate);
  document.addEventListener("keydown", _keyPush);
  document.addEventListener("click", _click);

  //キーボードかクリックを押したときに顔をジャンプさせる内部関数.
  function _keyPush(evt) {
    face.jump();
  }

  function _click(evt) {
    face.jump();
  }

  //fram_rateごとに実行するゲーム進行用の内部関数
  function _proceed_game() {
    frame_count += 1;
    context.drawImage(back_image, 0, 0, 300, 400);
    //残機を表示
    for (let i = 0; i < rest_lives; i++) {
      context.drawImage(happy_face, canv.width - (i + 1) * 20, 10, 20, 20);
    }
    //スコアを表示
    context.fillStyle = "white";
    context.font = "20px Arial";
    context.textAlign = "right";
    context.fillText(score, canv.width - 10, 50);
    //スコアによってスピードアップして難易度を上げる
    if (score != 0 && score % 100 == 0 && speed_up_flag == 0) {
      if (frame_rate >= 4) {
        frame_rate *= 0.9;
      } else {
        frame_rate = frame_rate
      }
      speed_up_flag = 1;
      clearInterval(timer);
      timer = setInterval(_proceed_game, frame_rate);
    }
    //顔の描画
    face.update();
    face.draw(context, 1); //笑顔を描画
    //パイプ群の描画
    if (frame_count % 40 == 0) {
      pipes.push(new Pipe(canv.height, canv.width));
    }
    for (let i = 0; i < pipes.length; i++) {
      if (pipes[i].x < -15) {
        pipes.splice(0, 1)
      }
      pipes[i].update();
      pipes[i].draw(context, 1);
    }
    //顔とパイプの接触判定
    _contact(face, pipes[0]);

    //ゲームオーバーの判定
    if (rest_lives <= 0) {
      rest_lives = 5;
      frame_rate = 30;
      clearInterval(timer);
      //timer = setInterval(game, frame_rate);
      console.log("game over");
      game_over(canv, context, score);
    }
  }

  //顔とパイプの接触判定のための内部関数
  function _contact(contact_face, contact_pipe) {
    frame_state_prev = frame_state;
    if (contact_face.x - 25 < contact_pipe.x && contact_pipe.x < contact_face.x + 10) {
      if (contact_face.y - 10 < contact_pipe.top_y) {
        contact_face.draw(context, 0)
        contact_pipe.draw(context, 0, 1)
        frame_state = 1;
      } else if (face.y + 10 > contact_pipe.height - contact_pipe.bottom_y) {
        contact_face.draw(context, 0)
        contact_pipe.draw(context, 0, 0)
        frame_state = 1;
      } else {
        frame_state = 0;
      }
    } else {
      frame_state = 0;
    }
    //顔がパイプを通過後の前フレームの残機と現フレームの残機を比較して得点を追加するかしないか判定
    if (contact_pipe.x <= contact_face.x - 25) {
      if (score_flag == 0) {
        score_flag = 1;
        if (rest_lives == rest_lives_prev) {
          score += 10;
          if (score != 0 && score % 100 == 0) {
            speed_up_flag = 0;
          }
        } else {
          rest_lives_prev = rest_lives;
        }
      }
    } else {
      score_flag = 0
    }
    //frame_stateが0→1の状態になっていたら残機をへらす
    if (frame_state_prev == 0 && frame_state == 1) {
      console.log(rest_lives);
      rest_lives_prev = rest_lives;
      rest_lives -= 1;
    }
  }
}


function game_over(canv, context, score) {
  let back_image = new Image();
  back_image.onload = function() {
    context.drawImage(back_image, 0, 0, 300, 400);
    context.font = "15pt Arial";
    context.fillStyle = "white";
    context.textAlign = "center";
    context.fillText("Your score: " + score, 150, 280);
    context.fillStyle = "gray";
    context.fillRect(90, 345, 120, 40);
    context.font = "15pt Arial";
    context.fillStyle = "white"
    context.fillText("続ける?", 150, 330);
    context.fillText("click here", 150, 370);
  }
  back_image.src = "assets/image/gameover.jpg";

  canv.addEventListener("click", _start_click);

  function _start_click(evt) {
    let left_offset = canv.offsetLeft;
    let top_offset = canv.offsetTop;
    let evt_x = evt.pageX;
    let evt_y = evt.pageY;
    let button_left = 90 + 10;
    let button_top = 345 + 10;
    let button_width = 120;
    let button_height = 40;
    //'click here'のボタンを押した時のみ画面遷移
    if (evt_x >= (left_offset + button_left) && evt_x <= (left_offset + button_left + button_width) &&
      evt_y >= (top_offset + button_top) && evt_y <= (top_offset + button_top + button_height)) {
      canv.removeEventListener("click", _start_click);
      start_game(canv, context);
    }
  }
}