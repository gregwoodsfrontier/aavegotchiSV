import Phaser from 'phaser'
import {SceneKeys} from '~/consts/SceneKeys'
import WebFontFile from './webFontFile'
import {AssetType, SoundType} from '../interface/assets'

export default class Preload extends Phaser.Scene
{
    preload()
    {
        const fonts = new WebFontFile(this.load, 'Press Start 2P')
        this.load.addFile(fonts)

        this.load.image('galaxy', '/images/galaxyBG.png');
        this.load.image('logo', '/images/banner.png');
        this.load.image('sushiVader', '/images/sushi-vader-font-in.png');

        this.load.image(AssetType.Bullet, "/images/bullet.png");
        this.load.image(AssetType.EnemyBullet, "/images/enemy-bullet.png");

        // player animation
        this.load.spritesheet(AssetType.Gotchi, "/images/gotchiMoves.png", {
            frameWidth: 32,
            frameHeight: 53,
        });
        //sushi animations
        this.load.spritesheet(AssetType.SushiLv1, "/images/sushiLv1Sht.png", {
            frameWidth: 60,
            frameHeight: 55,
        });
        this.load.spritesheet(AssetType.SushiLv2, "/images/sushiLv2Sht.png", {
            frameWidth: 60,
            frameHeight: 55,
        });
        this.load.spritesheet(AssetType.SushiLv3, "/images/sushiLv3Sht.png", {
            frameWidth: 60,
            frameHeight: 55,
        });
        
        this.load.spritesheet(AssetType.Kaboom, "/images/explode.png", {
            frameWidth: 128,
            frameHeight: 128,
        });
        this.load.image(AssetType.Gem, "/images/gem.png")
        
        this.sound.volume = 0.25;

        this.load.audio(SoundType.Shoot, "/audio/shoot.wav");
        this.load.audio(SoundType.Kaboom, "/audio/explosion.wav");
        this.load.audio(SoundType.InvaderKilled, "/audio/invaderkilled.wav");
    }

    create()
    {
        this.scene.start(SceneKeys.GameScene)
    }
}