import Phaser from 'phaser'
import {AssetType} from '../interface/assets'
import {ScoreManager} from '../interface/manager/scoreManager'

export default class GameOverScene extends Phaser.Scene
{
    scoreManager!: ScoreManager
    create()
    {
        this.add.image(400, 300, AssetType.Galaxy);
        this.scoreManager = new ScoreManager(this)
    }

    update()
    {

    }
}