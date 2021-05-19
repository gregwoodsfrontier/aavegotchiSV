import Phaser from 'phaser'
import WebFontFile from '../scenes/webFontFile'
import { AssetType, SoundType } from "../interface/assets";

const retro = {
    fontFamily: '"Press Start 2P"', 
    fontSize: '20'
} 

export default class BackGround extends Phaser.Scene
{
    preload()
    {
        this.load.image(AssetType.Galaxy, 'images/galaxyBG.png');
        
    }

    create()
    {
        this.add.image(400, 300, AssetType.Galaxy);
        // auto-game-over line
        this.add.rectangle(400, 480, 800, 5, 0xff33ff, 0.25)
        
    }

}