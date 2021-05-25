import { AssetType, SoundType } from "../interface/assets";
//import { GameState } from "../interface/gameState";
import { SceneKeys } from "~/consts/SceneKeys";
import { AnimationFactory, AnimationType } from "../interface/factory/animationFactory";
import { AssetManager } from "../interface/manager/assetManager";
import { Bullet } from "../interface/bullet";

const INFO_FORMAT = 
`Size:       %1
Spawned:    %2
Despawned:  %3`

export default class TestScene extends Phaser.Scene
{
    gotchi!: Phaser.Physics.Arcade.Sprite
    animationFactory!: AnimationFactory
    assetManager!: AssetManager
    bulletTime = 0
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    fireKey!: Phaser.Input.Keyboard.Key
    // immune state of gotchi
    IsStar: boolean = false
    IsStarTime: number = 2000
    //toggle autoshoot
    IsShooting: boolean = false

    private infoText?: Phaser.GameObjects.Text

    create()
    {
        
        this.scene.run(SceneKeys.BackGround)
        this.scene.sendToBack(SceneKeys.BackGround)
        
        this.gotchi = this.physics.add.sprite(400, 525, AssetType.Gotchi)
        this.gotchi.setCollideWorldBounds(true);
        this.gotchi.setScale(1.2);
        this.gotchi.play(AnimationType.GotchiFly)
        this.assetManager = new AssetManager(this)

        this.cursors = this.input.keyboard.createCursorKeys();
        this.fireKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        );
        
        
        //this.group = this.add.playerBulletPool()

    }

    update()
    {
        this._shipKeyboardHandler(this.gotchi);

        if (this.IsShooting === true)
        {
            this._fireBullet();
        }

        // only activate collider when gotchi is not immune
        /* if(!this.IsStar)
        {
            this.physics.collide(
                this.assetManager.enemyBullets,
                this.gotchi,
                this._enemyBulletHitGotchi,
                undefined,
                this
            );
        } */

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

    private _fireBullet() 
    {
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

    /* private _enemyBulletHitGotchi(_gotchi, _enemyBullet) {
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
        
    } */
}