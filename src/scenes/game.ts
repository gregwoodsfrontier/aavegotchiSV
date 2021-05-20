import { AssetType, SoundType } from "../interface/assets";
import { Bullet } from "../interface/bullet";
import { AssetManager } from "../interface/manager/assetManager";
import { SushiManager } from "../interface/manager/sushiManager";
import {
    AnimationFactory,
    AnimationType,
} from "../interface/factory/animationFactory";
import { Kaboom } from "../interface/kaboom";
import { ScoreManager } from "../interface/manager/scoreManager";
import { GameState } from "../interface/gameState";
import { SceneKeys } from "~/consts/SceneKeys";
import WebFontFile from '../scenes/webFontFile'
import {AttackFunc} from '../interface/attack'


export class GameScene extends Phaser.Scene {
    state!: GameState;
    gotchi!: Phaser.Physics.Arcade.Sprite
    animationFactory!: AnimationFactory
    scoreManager!: ScoreManager
    sushiManager!: SushiManager
    bulletTime = 0
    firingTimer = 0
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    fireKey!: Phaser.Input.Keyboard.Key
    restartKey!: Phaser.Input.Keyboard.Key
    assetManager!: AssetManager
    spawnTimer = 8000  // start spawning time later
    spawnDelay = 8000 // time passed to spawn the next row
    spawnArmy = [] as Phaser.Physics.Arcade.Sprite[]
    spawnEvent!: Phaser.Time.TimerEvent

    // enemy bullet period
    fireDelay = 1500

    // immune state of gotchi
    IsStar: boolean = false
    IsStarTime: number = 1100

    // make anoththe class for attack function
    attackFunc!: AttackFunc

    //debug use
    IsShown: boolean = false

    preload() {
        
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

        this.load.addFile(new WebFontFile(this.load, 'Press Start 2P'))
    }

    create() {

        this.scene.run(SceneKeys.BackGround)
        this.scene.sendToBack(SceneKeys.BackGround)
        this.state = GameState.Playing
        this.animationFactory = new AnimationFactory(this)
        this.scoreManager = new ScoreManager(this)
        this.sushiManager = new SushiManager(this)
        this.assetManager = new AssetManager(this)
        this.attackFunc = new AttackFunc(this)

        this.gotchi = this.physics.add.sprite(400, 525, AssetType.Gotchi)
        this.gotchi.setCollideWorldBounds(true);
        this.gotchi.setScale(1.2);
        this.gotchi.play(AnimationType.GotchiFly)


        this.cursors = this.input.keyboard.createCursorKeys();
        this.fireKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        );
        this.restartKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.D
        )
        
        // create spawnSushi event
        this.spawnEvent = new Phaser.Time.TimerEvent(
            {
                delay: this.spawnDelay,
                loop: true,
                callback: () =>
                {
                    if (this.state === GameState.Playing)
                    {
                        this.spawnArmy = this.spawnSushi();
                        this.spawnArmy.forEach(child => {
                            this.sushiManager.makeTween(child)
                        })
                    }
                },
                callbackScope: this,
            }
        )

        this.time.addEvent(this.spawnEvent)
                
    }

    update() {

        this._shipKeyboardHandler(this.gotchi);
        if (this.time.now > this.firingTimer) {
            this._enemyFires();
        }

        this.setOverlapForAll();

        // only activate collider when gotchi is not immune
        if(!this.IsStar)
        {
            this.physics.collide(
                this.assetManager.enemyBullets,
                this.gotchi,
                this._enemyBulletHitGotchi,
                undefined,
                this
            );
        }
        

        this.sushiCross();

        if (this.state != GameState.Playing)
        {
            this.physics.pause();
            if (this.restartKey.isDown)
            {
                console.log("Restart function")
                //this.scene.restart()
                this.restart()
            }
        }

       
    }

    // When sushi crossed a certain line, insta game over
    private sushiCross()
    {
        //console.log('sushi cross is called')
        let yline = 450
        this.sushiManager.lv1sushi.getChildren().forEach(c => {
            const child = c as Phaser.Physics.Arcade.Sprite
            if (child.y > yline)
            {
                this.callGameOver();
            }
        })
        this.sushiManager.lv2sushi.getChildren().forEach(c => {
            const child = c as Phaser.Physics.Arcade.Sprite
            if (child.y > yline)
            {
                this.callGameOver();
            }
        })
        this.sushiManager.lv3sushi.getChildren().forEach(c => {
            const child = c as Phaser.Physics.Arcade.Sprite
            if (child.y > yline)
            {
                this.callGameOver();
            }
        })
    }

    private setOverlapForAll()
    {
        this.physics.overlap(
            this.assetManager.bullets,
            this.sushiManager.lv1sushi,
            this._bulletHitSushis,
            undefined,
            this
        )

        this.physics.overlap(
            this.assetManager.bullets,
            this.sushiManager.lv2sushi,
            this._bulletHitSushis,
            undefined,
            this
        )

        this.physics.overlap(
            this.assetManager.bullets,
            this.sushiManager.lv3sushi,
            this._bulletHitSushis,
            undefined,
            this
        )

    }

    private spawnSushi(){

        let x: number[] = []
        for (let i=0; i<5; i++)
        {
            x.push(Phaser.Math.RND.integerInRange(1,3))
        }
        var _c = this.sushiManager.spawnSushi(x)
        this.spawnTimer = this.time.now + this.spawnDelay
        return _c
    }

    private _shipKeyboardHandler(_gotchi: Phaser.Physics.Arcade.Sprite) {
        _gotchi.setVelocity(0, 0)
        if (this.cursors.left.isDown) {
            _gotchi.setVelocityX(-200);
        } else if (this.cursors.right.isDown) {
            _gotchi.setVelocityX(200);
        }

        if (this.fireKey.isDown) {
            this._fireBullet();
        }
    }

    private callWin()
    {
        this.state = GameState.Win;
        this.scoreManager.increaseScore(1000)
        this.scoreManager.setHighScoreTextWin();
        this.tweens.pauseAll();
        this.physics.pause();
        this.assetManager.enemyBullets.clear(true, true);
        this.assetManager.bullets.clear(true, true);
        this.time.clearPendingEvents();
    }

    private callGameOver()
    {
        this.state = GameState.GameOver;
        this.scoreManager.setHighScoreTextLose();
        // this func clear the bullets
        this.assetManager.clearBullets();
        this.gotchi.disableBody(true, true);
        this.tweens.pauseAll();
        this.physics.pause();
        this.sushiManager.disableAllSushis();
        //this.spawnEvent.destroy()
    }

    private explosionEffects(_x:number, _y:number)
    {
        let explosion: Kaboom = this.assetManager.explosions.get();
        explosion.setPosition(_x, _y)
        explosion.play(AnimationType.Kaboom)
        this.sound.play(SoundType.InvaderKilled)
    }

    private _bulletHitSushis(bullet, sushi)
    {   
        this.explosionEffects(sushi.x, sushi.y)    
        bullet.destroy()
        sushi.lives -= 1
        sushi.setTint(0xff33ff, 0xffff00, 0x0000ff, 0xff0000) 
        if(sushi.lives === 0 || sushi.lives < 0)
        {
            sushi.destroy()
            this.scoreManager.increaseScore(sushi.score)
        }
        if(!this.sushiManager.noAliveSushis)
        {
            this.callWin();
        }
    }


    private _enemyBulletHitGotchi(_gotchi, _enemyBullet) {
        let explosion: Kaboom = this.assetManager.explosions.get();
        _enemyBullet.kill();
        let live: Phaser.GameObjects.Sprite = this.scoreManager.glives.getFirstAlive();
        if (live && !this.IsStar) {
            live.setActive(false).setVisible(false);
            this.IsStar = !this.IsStar
            this.gotchi.setAlpha(0.5)
            this.time.delayedCall(this.IsStarTime,() =>
                {
                    this.IsStar = !this.IsStar
                    this.gotchi.setAlpha(1)
                }
            )
        }

        explosion.setPosition(this.gotchi.x, this.gotchi.y);
        explosion.play(AnimationType.Kaboom);
        this.sound.play(SoundType.Kaboom)
        if (this.scoreManager.noMoreLives) {
            this.callGameOver();
        }
        
    }

    private _enemyFires() {

        if (!this.gotchi.active) {
            return;
        }
        let enemyBullet = this.assetManager.enemyBullets.get();
        let enemyBulletL = this.assetManager.enemyBullets.get();
        let enemyBulletR = this.assetManager.enemyBullets.get();
        let livingSushi = this.sushiManager.getRandomAliveEnemy()
        
        
        if (enemyBullet && livingSushi)
        {
            enemyBullet.setPosition(livingSushi.x, livingSushi.y)            
            let angle0 = this.physics.moveToObject(enemyBullet, this.gotchi, 200)
            const dangle = 0.375
            //@ts-ignore
            if (livingSushi.sprite === AssetType.SushiLv1)
            {
                this.attackFunc.singleShot(enemyBullet, this.gotchi)
                
            }//@ts-ignore
            else if (livingSushi.sprite === AssetType.SushiLv2)
            {
                enemyBullet.setScale(3)
                this.physics.moveToObject(enemyBullet, this.gotchi, 250);
            }//@ts-ignore
            else if (livingSushi.sprite === AssetType.SushiLv3)
            {
                enemyBulletL.setPosition(livingSushi.x, livingSushi.y)
                enemyBulletR.setPosition(livingSushi.x, livingSushi.y)
                enemyBullet.setScale(3)
                enemyBulletL.setScale(3)
                enemyBulletR.setScale(3)
                this.physics.moveToObject(enemyBullet, this.gotchi, 250);
                enemyBulletL.setVelocity(250 * Math.cos(angle0-dangle), 250 * Math.sin(angle0-dangle))
                enemyBulletR.setVelocity(250 * Math.cos(angle0+dangle), 250 * Math.sin(angle0+dangle))
            }

            this.firingTimer = this.time.now + this.fireDelay;
        }

    } 



    private _fireBullet() {
        if (!this.gotchi.active) {
            return;
        }

        if (this.time.now > this.bulletTime) {
            let bullet: Bullet = this.assetManager.bullets.get();
            if (bullet) {
                bullet.shoot(this.gotchi.x, this.gotchi.y - 18);
                this.sound.play(SoundType.Shoot)
                this.bulletTime = this.time.now + 400;
            }
        }
    }

    restart() {
        this.state = GameState.Playing;
        this.gotchi.enableBody(true, this.gotchi.x, this.gotchi.y, true, true);
        this.scoreManager.resetData();
        this.scoreManager.hideText();
        this.sushiManager.reset();
        this.assetManager.reset();
        this.spawnArmy = []
        this.tweens.resumeAll();
        this.physics.resume();
        this.time.clearPendingEvents();
        this.time.addEvent(this.spawnEvent);
        this.gotchi.setAlpha(1)
    }
}