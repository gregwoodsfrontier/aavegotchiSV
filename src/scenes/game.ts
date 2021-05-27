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
import Gotchi from "../interface/gotchi";

export class GameScene extends Phaser.Scene {
    escapeTheFud!: Phaser.Sound.BaseSound
    state!: GameState;
    gotchi!: Phaser.GameObjects.Sprite
    animationFactory!: AnimationFactory
    scoreManager!: ScoreManager
    sushiManager!: SushiManager
    bulletTime = 0
    firingTimer = 0
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    fireKey!: Phaser.Input.Keyboard.Key
    restartKey!: Phaser.Input.Keyboard.Key
    assetManager!: AssetManager

    spawnTimer = 4000  // start spawning time later
    //fastspawnTimer = 4000  // start spawning time later
    //fastDescend = 60

    spawnArmy = [] as Phaser.Physics.Arcade.Sprite[]
    spawnEvent!: Phaser.Time.TimerEvent

    // enemy bullet period
    fireDelay = 1500
    fireDelayModifer = 0.85
    lowFireDelay = this.fireDelay*this.fireDelayModifer

    // immune state of gotchi
    IsStar: boolean = false
    IsStarTime: number = 2000

    //toggle autoshoot
    IsShooting: boolean = false

    //debug use
    IsShown: boolean = false
    info!: Phaser.GameObjects.Text

    create() {

        this.scene.run(SceneKeys.BackGround)
        this.scene.sendToBack(SceneKeys.BackGround)
        this.state = GameState.Playing

        this.animationFactory = new AnimationFactory(this)
        this.scoreManager = new ScoreManager(this)
        this.sushiManager = new SushiManager(this)
        this.assetManager = new AssetManager(this)
        this.escapeTheFud = this.sound.add(SoundType.EscapeTheFud, {
            loop: true,
            seek: 118
        })
        this.escapeTheFud.play()

        this.gotchi = new Gotchi(this, 400, 525)
        this.add.existing(this.gotchi)

        console.log(this.gotchi)
        //this.gotchi = this.physics.add.sprite(400, 525, AssetType.Gotchi)
        this.gotchi.setSize(43, 50)
        //this.gotchi.body.setSize(43, 50, true)
        //this.gotchi.setCollideWorldBounds(true);
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
                delay: this.spawnTimer,
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
        this.info = this.add.text(0, 0, '', { color: '#00ff00' } )
        
    }

    update() 
    {

        
        if (this.state !== GameState.Playing)
        {
            this.escapeTheFud.pause()
        }
        else
        {
            this.escapeTheFud.resume()
        }
        // call debug here
        //this.debugCall();        

        //when score > 10k
        this.checkToIncreaseFireRate();

        this._shipKeyboardHandler(this.gotchi);

        if (this.time.now > this.firingTimer) {
            this._enemyFires();
        }

        if (this.IsShooting === true)
        {
            this._fireBullet();
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
        
        // check if the sushi cross a certain line
        this.sushiCross();

        if (this.state != GameState.Playing)
        {
            this.physics.pause();
            if (this.restartKey.isDown)
            {
                //this.scene.restart()
                this.restart()
            }
        }       
    }

    private checkToIncreaseFireRate()
    {
        if (this.scoreManager.score >= 10000)
        {
            this.fireDelay = this.lowFireDelay
            this.scoreManager.scoreText.setTint(0xffffb3)
            
        }
    }

    // debug purpose
    private debugCall()
    {
        this.info.setPosition(0, 410)
        this.info.setText([
            'player Bullet used: '+this.assetManager.bullets.getTotalUsed(),
            'player Bullet free: '+this.assetManager.bullets.getTotalFree(),
            'enemy  Bullet used: '+this.assetManager.enemyBullets.getTotalUsed(),
            'enemy  Bullet free: '+this.assetManager.enemyBullets.getTotalFree(),
            'explosion     used: '+ this.assetManager.explosions.getTotalUsed(),
            'explosion     free: '+ this.assetManager.explosions.getTotalFree(),
            'lv1sushi      used: '+this.sushiManager.lv1sushi.getTotalUsed(),
            'lv1sushi      free: '+this.sushiManager.lv1sushi.getTotalFree(),
            'lv2sushi      used: '+this.sushiManager.lv2sushi.getTotalUsed(),
            'lv2sushi      free: '+this.sushiManager.lv2sushi.getTotalFree(),
            'lv3sushi      used: '+this.sushiManager.lv3sushi.getTotalUsed(),
            'lv3sushi      free: '+this.sushiManager.lv3sushi.getTotalFree(),
        ])
    }

    // When sushi crossed a certain line, insta game over
    private sushiCross()
    {
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
        this.spawnTimer = this.time.now + this.spawnTimer
        return _c
    }

    private _shipKeyboardHandler(_gotchi) {
        _gotchi.body.setVelocity(0, 0)
        if (this.cursors.left.isDown) {
            _gotchi.body.setVelocityX(-250);
        } else if (this.cursors.right.isDown) {
            _gotchi.body.setVelocityX(250);
        }

        if (Phaser.Input.Keyboard.JustDown(this.fireKey)) {
            this.IsShooting = !this.IsShooting
        }
    }

    private callGameOver()
    {
        this.state = GameState.GameOver;
        this.IsShooting = false;
        this.IsStar = false;
        this.scoreManager.setHighScoreTextLose();
        // this func clear the bullets
        this.assetManager.clearBullets();
        this.gotchi.setActive(false)
        //this.gotchi.body.enable = false;
        this.gotchi.visible = false;
        //this.gotchi.disableBody(true, true);
        this.tweens.pauseAll();
        this.physics.pause();
        this.sushiManager.disableAllSushis();
        
    }

    private explosionEffects(_x:number, _y:number)
    {
        let explosion: Kaboom = this.assetManager.explosions.get();
        explosion.setPosition(_x, _y)
        explosion.play(AnimationType.Kaboom)
        this.sound.play(SoundType.InvaderKilled)
        this.time.delayedCall(2000,() => {
            explosion.kill()
        })
        
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
            this.callGameOver();
        }
    }


    private _enemyBulletHitGotchi(_gotchi, _enemyBullet) {
        let explosion: Kaboom = this.assetManager.explosions.get();
        _enemyBullet.kill();
        let live: Phaser.GameObjects.Sprite = this.scoreManager.glives.getFirstAlive();

        if (live && !this.IsStar) {
            live.setActive(false).setVisible(false);
            this.IsStar = true
            this.gotchi.setAlpha(0.5)
            this.time.delayedCall(this.IsStarTime,() =>
                {
                    this.IsStar = false
                    this.gotchi.setAlpha(1)
                }
            )
        }

        explosion.setPosition(this.gotchi.x, this.gotchi.y);
        explosion.play(AnimationType.Kaboom);
        this.sound.play(SoundType.Kaboom)
        this.time.delayedCall(2000,() => {
            explosion.kill()
        })
        
        if (this.scoreManager.noMoreLives) {
            this.callGameOver();
        }
        
    }

    private _enemyFires() {

        if (!this.gotchi.active) {
            return;
        }
        let eB = [
            this.assetManager.enemyBullets.get(),
            this.assetManager.enemyBullets.get(),
            this.assetManager.enemyBullets.get()
        ]
        
        let livingSushi = this.sushiManager.getRandomAliveEnemy()
        
        if (eB[0] && livingSushi)
        {           
            let angle0 = this.physics.moveToObject(eB[0], this.gotchi, 200)
            const dangle = 0.375
            //@ts-ignore
            if (livingSushi.sprite === AssetType.SushiLv1)
            {
                //@ts-ignore
                livingSushi.shoot(eB[0], this.gotchi)
                
                
            }//@ts-ignore
            else if (livingSushi.sprite === AssetType.SushiLv2)
            {
                //@ts-ignore
                livingSushi.shoot(eB[0], eB[1], this.gotchi)
                                
            }//@ts-ignore
            else if (livingSushi.sprite === AssetType.SushiLv3)
            {
                //@ts-ignore
                livingSushi.shoot(eB[0], eB[1],  eB[2], this.gotchi)

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
        this.gotchi.setActive(true);
        //this.gotchi.body.enable = true;
        this.gotchi.visible = true;
        //this.gotchi.enableBody(true, this.gotchi.x, this.gotchi.y, true, true);
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
        this.IsShooting = false
    
    }
}