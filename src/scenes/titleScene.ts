import Phaser from 'phaser'
import { SceneKeys } from '~/consts/SceneKeys';
import blinkText from '../interface/blinkText'
//import WebFontFile from './webFontFile'

const retro = {
    fontFamily: '"Press Start 2P"', 
    fontSize: '30px'
}  

export default class TitleScene extends Phaser.Scene
{
    create()
    {
        this.add.image(400, 300, 'galaxy');
        this.add.image(400, 150, 'logo').setScale(0.4, 0.4);
        this.add.image(400, 300, 'sushiVader');
        this.add.text(400, 375, 'V1.2.3', retro).setOrigin(0.5, 0);
        const startText = this.add.text(400, 450, 'Hit D to start', retro).setOrigin(0.5, 0);
        const blinkDelay = 500;
        // blinking text
        this.time.addEvent(
            {
                delay: 500,
                loop: true,
                callbackScope:this,
                callback: blinkText,
                args:[this, startText, blinkDelay]
                
            }
        )

        this.input.keyboard.once('keydown-D', () =>
        {
            this.cameras.main.fadeOut(1000, 0, 0, 0)
        })
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
            (cam, effect) =>
            {
                //this.scene.start(SceneKeys.GameOverScene);
                this.scene.start(SceneKeys.GameScene);
            })
    }
}
