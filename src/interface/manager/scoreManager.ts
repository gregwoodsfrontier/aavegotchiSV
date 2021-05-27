import { AssetType } from "../assets";
import WebFontFile from '../../scenes/webFontFile'

export class ScoreManager {
  scoreText!: Phaser.GameObjects.Text;
  highscoreText!: Phaser.GameObjects.Text;
  livesText!: Phaser.GameObjects.Text;
  restartText!: Phaser.GameObjects.Text;
  line1Text!: Phaser.GameObjects.Text;
  line2Text!: Phaser.GameObjects.Text;
  line3Text!: Phaser.GameObjects.Text;
  line4Text!: Phaser.GameObjects.Text;
  glives!: Phaser.Physics.Arcade.Group;
  highScore: number = 0;
  score = 0;
  l1texty = 150;
  l1textdy = 90;
  

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
    this.scoreText = this._scene.add.text(10, SIZE_Y*0.01, `SCORE: 0`, normalTextConfig);
    this.highscoreText = this._scene.add.text(10, SIZE_Y*0.075, `HIGH:  0`, normalTextConfig);

    this._setLivesText(SIZE_X, SIZE_Y, normalTextConfig);

    this.line1Text = this._scene.add
      .text(SIZE_X / 2, this.l1texty, "", bigTextConfig)
      .setOrigin(0.5);

    this.line2Text = this._scene.add
      .text(SIZE_X / 2, this.l1texty+this.l1textdy, "", bigTextConfig)
      .setOrigin(0.5);
    
    this.line3Text = this._scene.add
      .text(SIZE_X / 2, this.l1texty+this.l1textdy*2, "", bigTextConfig)
      .setOrigin(0.5);
    
    this.line4Text = this._scene.add
      .text(SIZE_X / 2, this.l1texty+this.l1textdy*3, "", bigTextConfig)
      .setOrigin(0.5);

  
  }

  private _setLivesText(
    SIZE_X: number,
    SIZE_Y: number,
    textConfig: { fontSize: string; fontFamily: string; color: string }
  ) {
    this.livesText = this._scene.add.text(SIZE_X - 120, SIZE_Y*0.01, `LIVES: `, textConfig).setOrigin(1,0);
    this.glives = this._scene.physics.add.group({
      maxSize: 3,
      runChildUpdate: true,
    });
    this.resetData();
  }

  resetData() {
    let SIZE_X = this._scene.game.canvas.width;
    this.glives.clear(true, true)
    for (let i = 0; i < 3; i++) {
      let _gem: Phaser.GameObjects.Sprite = this.glives.create(
        SIZE_X - 190*0.6 + 70 * i * 0.6,
        30,
        AssetType.Gem
      );
      _gem.setOrigin(0.5, 0.5);
      _gem.setAlpha(0.8);
      _gem.setScale(0.6)
    }
    this.score = 0;
    this.scoreText.setText(`SCORE: 0`)
    this.scoreText.setTint(0xffffff)
  }

  private _setBigText(line1: string, line2: string, line3: string, line4: string) {
    this.line1Text.setText(line1);
    this.line2Text.setText(line2);
    this.line3Text.setText(line3);
    this.line4Text.setText(line4);
  }

  hideText() {
    this._setBigText("", "", "","")
  }

  private setRestartText()
  {
    this.restartText = this.line3Text.setText('Hit D to restart')
    this.line4Text.setText('Credit to @jo0wz\n  for FUD music')
  }

  setHighScoreTextWin()
  {
    if (this.score > this.highScore) {
      this.highScore = this.score;
      this._scene.registry.set('highscore', this.highScore)
    }

    if (this._scene.registry.get('highscore') != undefined)
    {
      this.highscoreText.setText(`HIGH:  ${this._scene.registry.get('highscore')}`)
      this._setBigText("GAME OVER", 
      `HIGH SCORE: ${this._scene.registry.get('highscore')}`,
      "","")
      this.setRestartText();
      
    }
    else
    {
      this.highscoreText.setText(`HIGH:  0`)
      this._setBigText("GAME OVER", 
      `HIGH SCORE: 0`,
      "","")
      this.setRestartText();
    }
  }

  setHighScoreTextLose()
  {
    if (this.score > this.highScore) {
      this.highScore = this.score;
      this._scene.registry.set('highscore', this.highScore)
    }

    if (this._scene.registry.get('highscore') != undefined)
    {
      this.highscoreText.setText(`HIGH:  ${this._scene.registry.get('highscore')}`)
      this._setBigText("GAME OVER", 
      `HIGH SCORE: ${this._scene.registry.get('highscore')}`,
      "","")
      this.setRestartText();
    }
    else
    {
      this.highscoreText.setText(`HIGH:  0`)
      this._setBigText("GAME OVER", 
      `HIGH SCORE: 0`,
      "","")
      this.setRestartText();
    }
    
  }

  print() {
    this.scoreText.setText(`SCORE: ${this.score}`);
  }

  increaseScore(step: number) {
    this.score += step;
    this.print();
  }

  
}