import Phaser from 'phaser'
import { SceneKeys } from '~/consts/SceneKeys';
import WebFontFile from './webFontFile'

const retro = {
    fontFamily: '"Press Start 2P"', 
    fontSize: '30px'
}  

export default class TitleScene extends Phaser.Scene
{
	
    
	preload()
    {
  
        this.load.image('galaxy', '/images/galaxyBG.png');
        this.load.image('logo', '/images/banner.png');
        this.load.image('sushiVader', '/images/sushi-vader-font-in.png');
        this.load.addFile(new WebFontFile(this.load, 'Press Start 2P'))
    }

    create()
    {
        this.add.image(400, 300, 'galaxy');
        this.add.image(400, 150, 'logo').setScale(0.4, 0.4);
        this.add.image(400, 300, 'sushiVader');
        const startText = this.add.text(400, 110, 'Hit D to start', retro).setOrigin(0.5, 0);
        const blinkDelay = 500;
        // blinking text
        this.time.addEvent(
            {
                delay: 1000,
                loop: true,
                callbackScope:this,
                callback: () => {
                    if (startText.alpha === 1)
                    {
                        this.time.delayedCall(blinkDelay, () =>
                        {
                            startText.setAlpha(0);
                        }) 
                    }
                    else
                    {
                        this.time.delayedCall(blinkDelay, () =>
                        {
                            startText.setAlpha(1);
                        })
                    }
                }
            }
        )

        this.input.keyboard.once('keydown-D', () =>
        {
            this.cameras.main.fadeOut(1000, 0, 0, 0)
        })
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
            (cam, effect) =>
            {
                this.scene.start(SceneKeys.GameScene);
            })
    }
}
