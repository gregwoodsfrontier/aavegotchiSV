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

    create() {

        this.scene.run(SceneKeys.BackGround)
        this.scene.sendToBack(SceneKeys.BackGround)
        this.state = GameState.Playing

        this.animationFactory = new AnimationFactory(this)
        this.scoreManager = new ScoreManager(this)
        this.sushiManager = new SushiManager(this)
        this.assetManager = new AssetManager(this)
        //this.attackFunc = new AttackFunc(this)

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
    }

    update() {

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

    /* private checkToIncreaseSpawnRate()
    {
        if (this.scoreManager.score >= 100)
        {
            this.spawnTimer = this.fastspawnTimer
            this.sushiManager.descend = this.fastDescend
            if(!this.IsShown)
            {
                console.log(this.spawnTimer)
                console.log(this.sushiManager.descend)
                this.IsShown = true
            }
            
        }
    } */

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
        console.log(`lv1 sushi length: ${this.sushiManager.lv1sushi.getChildren().length}`)
        console.log(`lv2 sushi length: ${this.sushiManager.lv2sushi.getChildren().length}`)
        console.log(`lv3 sushi length: ${this.sushiManager.lv3sushi.getChildren().length}`)
    }

    // When sushi crossed a certain line, insta game over
    private sushiCross()
    {
        let yline = 500
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

    private _shipKeyboardHandler(_gotchi: Phaser.Physics.Arcade.Sprite) {
        _gotchi.setVelocity(0, 0)
        if (this.cursors.left.isDown) {
            _gotchi.setVelocityX(-250);
        } else if (this.cursors.right.isDown) {
            _gotchi.setVelocityX(250);
        }

        if (Phaser.Input.Keyboard.JustDown(this.fireKey)) {
            this.IsShooting = !this.IsShooting
        }
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
            this.callGameOver();
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
                this.singleShot(eB[0], 2.5, livingSushi.x, livingSushi.y)
                
            }//@ts-ignore
            else if (livingSushi.sprite === AssetType.SushiLv2)
            {
                this.twinShot(eB, livingSushi, this.gotchi)
                /* this.singleShot(eB[0], 3, livingSushi.x, livingSushi.y)
                this.singleShot(eB[1], 3, livingSushi.x, livingSushi.y)
                eB[1].setVelocity(250 * Math.cos(angle0-dangle), 250 * Math.sin(angle0-dangle)) */
                                
            }//@ts-ignore
            else if (livingSushi.sprite === AssetType.SushiLv3)
            {
                this.radiantShot(eB, livingSushi, this.gotchi)
            }

            this.firingTimer = this.time.now + this.fireDelay;
        }

    }
    
    private singleShot(bullet: Phaser.Physics.Arcade.Sprite, _scale:number, _x:number, _y:number)
    {
        bullet.setPosition(_x, _y)
        bullet.setScale(_scale)
        this.physics.moveToObject(bullet, this.gotchi, 250);
    }

    private twinShot(_eb: Phaser.Physics.Arcade.Sprite[],  _sushi: Phaser.Physics.Arcade.Sprite,
        _gotchi: Phaser.Physics.Arcade.Sprite)
    {
        let shootVArray = [] as Phaser.Math.Vector2[]
        for (let a=0;a<3;a++)
        {
            let b = new Phaser.Math.Vector2(_gotchi.x-_sushi.x, _gotchi.y-_sushi.y).setLength(250)
            shootVArray.push(b)
        }
        const dangle = 0.18
        let c = shootVArray[1].angle()
        for (let a=0;a<3;a++)
        {
            shootVArray[a].setAngle(c+(a-1)*dangle)
        }
        
        for (let i=0; i<3; i++)
        {
            if (i === 1)
            {
                continue
            }
            _eb[i].setPosition(_sushi.x, _sushi.y)
            _eb[i].setScale(3)
            _eb[i].setVelocity(shootVArray[i].x, shootVArray[i].y)
        }
    }

    private radiantShot(_eb: Phaser.Physics.Arcade.Sprite[],  _sushi: Phaser.Physics.Arcade.Sprite,
        _gotchi: Phaser.Physics.Arcade.Sprite)
    {
        let shootVArray = [] as Phaser.Math.Vector2[]
        for (let a=0;a<3;a++)
        {
            let b = new Phaser.Math.Vector2(_gotchi.x-_sushi.x, _gotchi.y-_sushi.y).setLength(250)
            shootVArray.push(b)
        }
        const dangle = 0.375
        let c = shootVArray[1].angle()
        for (let a=0;a<3;a++)
        {
            shootVArray[a].setAngle(c+(a-1)*dangle)
        }
        
        for (let i=0; i<3; i++)
        {
            _eb[i].setPosition(_sushi.x, _sushi.y)
            _eb[i].setScale(3)
            _eb[i].setVelocity(shootVArray[i].x, shootVArray[i].y)
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
        this.IsShooting = false
    
    }
}