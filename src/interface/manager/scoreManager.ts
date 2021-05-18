import { AssetType } from "../assets";
import WebFontFile from '../../scenes/webFontFile'

export class ScoreManager {
  scoreText!: Phaser.GameObjects.Text;
  highscoreText!: Phaser.GameObjects.Text;
  line1Text!: Phaser.GameObjects.Text;
  line2Text!: Phaser.GameObjects.Text;
  line3Text!: Phaser.GameObjects.Text;
  glives!: Phaser.Physics.Arcade.Group;
  highScore = 0;
  score = 0;

  get noMoreLives() {
    return this.glives.countActive(true) === 0;
  }

  constructor(private _scene: Phaser.Scene) {
    this._init();
    this.print(); 
  }

  private _init() {
    const { width: SIZE_X, height: SIZE_Y } = this._scene.game.canvas;
    const textConfig = {
      fontFamily: '"Press Start 2P"',
      color: "#ffffff"
    };

    const normalTextConfig = {
      ...textConfig,
      fontSize: '30px'
    };

    const bigTextConfig = {
      ...textConfig,
      fontSize: '36px'
    };
    
    this._scene.load.addFile(new WebFontFile(this._scene.load, 'Press Start 2P'))
    this.scoreText = this._scene.add.text(10, -SIZE_Y*0.5, `SCORE: 0`, normalTextConfig);

    this._setLivesText(SIZE_X, SIZE_Y, normalTextConfig);

    this.line1Text = this._scene.add
      .text(SIZE_X / 2, 120, "", bigTextConfig)
      .setOrigin(0.5);

    this.line2Text = this._scene.add
      .text(SIZE_X / 2, 240, "", bigTextConfig)
      .setOrigin(0.5);
    
    this.line3Text = this._scene.add
      .text(SIZE_X / 2, 360, "", bigTextConfig)
      .setOrigin(0.5);
  
  }

  private _setLivesText(
    SIZE_X: number,
    SIZE_Y: number,
    textConfig: { fontSize: string; fontFamily: string; color: string }
  ) {
    this._scene.add.text(SIZE_X - 120, -SIZE_Y*0.5, `LIVES: `, textConfig).setOrigin(1,0);
    this.glives = this._scene.physics.add.group({
      maxSize: 3,
      runChildUpdate: true,
    });
    this.resetLives();
  }

  resetLives() {
    let SIZE_X = this._scene.game.canvas.width;
    this.glives.clear(true, true)
    for (let i = 0; i < 3; i++) {
      let _gem: Phaser.GameObjects.Sprite = this.glives.create(
        SIZE_X - 190*0.6 + 70 * i * 0.6,
        35,
        AssetType.Gem
      );
      _gem.setOrigin(0.5, 0.5);
      _gem.setAlpha(0.8);
      _gem.setScale(0.6)
    }
  }

  private _setBigText(line1: string, line2: string, line3: string) {
    this.line1Text.setText(line1);
    this.line2Text.setText(line2);
    this.line3Text.setText(line3);
  }

  setWinText() {
    this._setBigText("YOU WON!", "PRESS D","FOR NEW GAME");
  }

  setGameOverText() {
    this._setBigText("GAME OVER", "PRESS D", "FOR NEW GAME");
  }

  hideText() {
    this._setBigText("", "", "")
  }

  private setHighScore() {
    if (this.score > this.highScore) {
      this.highScore = this.score;
    }
    this.score = 0;
    this.print();
  }

  setHighScoreText()
  {
    this._setBigText("YOU WON!", `HIGH SCORE: ${this.highScore}`,"HIT D FOR NEW GAME")
  }

  print() {
    this.scoreText.setText(`SCORE: ${this.score}`);
  }

  increaseScore(step = 200) {
    this.score += step;
    this.print();
  }

  
}