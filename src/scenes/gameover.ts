import Phaser, { Game } from 'phaser'
import { ScoreManager } from "../interface/manager/scoreManager";
import { GameState } from "../interface/gameState";
import { SceneKeys } from "~/consts/SceneKeys";
import WebFontFile from '../scenes/webFontFile';
import { GameScene } from '../scenes/game'

export default class GameOverScene extends Phaser.Scene
{
    scoreManager!: ScoreManager
    preload()
    {
        this.load.addFile(new WebFontFile(this.load, 'Press Start 2P'))
    }

    create()
    {
        this.scoreManager = new ScoreManager(this)
        this.scene.run(SceneKeys.BackGround)
        this.scene.sendToBack(SceneKeys.BackGround)
        this.scoreManager.setHighScoreText();
    }
}