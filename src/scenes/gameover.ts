import Phaser from 'phaser'
import {AssetType} from '../interface/assets'
import {ScoreManager} from '../interface/manager/scoreManager'
import blinkText from '../interface/blinkText'
import { SceneKeys } from '~/consts/SceneKeys'
import {GameScene} from './game'
export default class GameOverScene extends Phaser.Scene
{
    scoreManager!: ScoreManager
    highscoreText!: Phaser.GameObjects.Text
    replayText!: Phaser.GameObjects.Text
    //hs = this.registry.get('highscore')
    restartGKey!: Phaser.Input.Keyboard.Key

    create()
    {
        this.add.image(400, 300, AssetType.Galaxy);
        this.scoreManager = new ScoreManager(this);
        this.scoreManager.highscoreText.setVisible(false);
        this.scoreManager.scoreText.setVisible(false);
        this.scoreManager.livesText.setVisible(false);
        this.scoreManager.glives.setVisible(false);

        this.add.text(400, 100, "GAME SET", {
            fontFamily: '"Press Start 2P"',
            fontSize: '30px',
            color: "#ffffff"    
        }).setOrigin(0.5)

        this.replayText = this.add.text(400, 180, "HIT D TO REPLAY", {
            fontFamily: '"Press Start 2P"',
            fontSize: '30px',
            color: "#ffffff"    
        }).setOrigin(0.5)

        this.time.addEvent(
            {
                delay: 500,
                loop: true,
                callbackScope:this,
                callback: blinkText,
                args:[this, this.replayText, 500]
                
            }
        )

        this.highscoreText = this.add.text(100, 250, `HIGH SCORE: 0`, {
            fontFamily: '"Press Start 2P"',
            fontSize: '30px',
            color: "#ffffff"    
        })

        if (this.scoreManager.highScore != undefined)
        {
            this.highscoreText.setText(`HIGH SCORE: ${this.scoreManager.highScore}`)
        }

        this.restartGKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.D
        )
    }

    update()
    {
        if (Phaser.Input.Keyboard.JustDown(this.restartGKey))
        {
            this.scene.stop(SceneKeys.GameOverScene)
            let gs = this.scene.get(SceneKeys.GameScene)
            gs.scene.restart();
        }

    }
}