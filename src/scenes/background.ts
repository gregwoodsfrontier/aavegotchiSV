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
        
    }

}