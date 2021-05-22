import Phaser from 'phaser'
//import WebFontFile from '../scenes/webFontFile'
import { AssetType, SoundType } from "../interface/assets";

/* const retro = {
    fontFamily: '"Press Start 2P"', 
    fontSize: '20'
}  */

export default class BackGround extends Phaser.Scene
{
    tileSprite!: Phaser.GameObjects.TileSprite
    preload()
    {
        this.load.image(AssetType.Galaxy, 'images/galaxyBG.png');
        
    }

    create()
    {
        this.tileSprite = this.add.tileSprite(400, 300, 800, 600, AssetType.Galaxy);
        // auto-game-over line
        this.add.rectangle(400, 480, 800, 5, 0xff33ff, 0.25)
        
    }

    update()
    {

        this.tileSprite.tilePositionY -= 2
    }

}