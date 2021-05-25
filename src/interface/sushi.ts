import { AssetType, SoundType } from './assets'
import { EnemyBullet } from './enemyBullet'
import { AssetManager } from './manager/assetManager'

interface sushiTypeType
{
    maxlife: number
    lives: number,
    sprite: string,
    score: number
}

export class Lv1Sushi extends Phaser.Physics.Arcade.Sprite implements sushiTypeType 
{
    assetManger: AssetManager = new AssetManager(this.scene)
    maxlife = 1
    lives = 1
    sprite = AssetType.SushiLv1;
    score = 100

    constructor(scene: Phaser.Scene, x: number, y: number)
    {
        super(scene, x, y, AssetType.SushiLv1);
    }

    shoot(ebullet: EnemyBullet, target: Phaser.Physics.Arcade.Sprite)
    {
        ebullet.setPosition(this.x, this.y)
        ebullet.setScale(2)
        ebullet.setCircle(4, 0, 0)
        this.scene.physics.moveToObject(ebullet, target, 250)
    }

}

export class Lv2Sushi extends Phaser.Physics.Arcade.Sprite implements sushiTypeType 
{
    maxlife = 2;
    lives = 2;
    sprite = AssetType.SushiLv2;
    score = 200

    constructor(scene: Phaser.Scene, x: number, y: number)
    {
        super(scene, x, y, AssetType.SushiLv2);
    }

    shoot(eb0: EnemyBullet,
        eb1: EnemyBullet,
        target: Phaser.Physics.Arcade.Sprite)
    {
        let b0 = new Phaser.Math.Vector2(target.x - this.x, target.y - this.y).setLength(250)
        let b1 = new Phaser.Math.Vector2(target.x - this.x, target.y - this.y).setLength(250)
        b0.setAngle(b0.angle() + 0.2)
        b1.setAngle(b1.angle() - 0.2)

        eb0.setPosition(this.x, this.y);
        eb1.setPosition(this.x, this.y);
        eb0.setScale(3);
        eb1.setScale(3);
        eb0.setCircle(this.scale * 4, 0 ,0);
        eb1.setCircle(this.scale * 4, 0, 0);
        eb0.setVelocity(b0.x, b0.y)
        eb1.setVelocity(b1.x, b1.y)
    }

}

export class Lv3Sushi extends Phaser.Physics.Arcade.Sprite implements sushiTypeType 
{
    maxlife = 3
    lives = 3;
    sprite = AssetType.SushiLv3;
    score = 300

    constructor(scene: Phaser.Scene, x: number, y: number)
    {
        super(scene, x, y, AssetType.SushiLv3);
    }

    shoot(eb0: EnemyBullet,
        eb1: EnemyBullet,
        eb2: EnemyBullet,
        target: Phaser.Physics.Arcade.Sprite)
    {
        let b0 = new Phaser.Math.Vector2(target.x - this.x, target.y - this.y).setLength(250)
        let b1 = new Phaser.Math.Vector2(target.x - this.x, target.y - this.y).setLength(250)
        let b2 = new Phaser.Math.Vector2(target.x - this.x, target.y - this.y).setLength(250)
        b0.setAngle(b0.angle() + 0.4)
        b1.setAngle(b1.angle() - 0.4)

        eb0.setPosition(this.x, this.y);
        eb1.setPosition(this.x, this.y);
        eb2.setPosition(this.x, this.y);

        eb0.setScale(3);
        eb1.setScale(3);
        eb2.setScale(3);

        eb0.setCircle(this.scale * 4, 0 ,0);
        eb1.setCircle(this.scale * 4, 0, 0);
        eb2.setCircle(this.scale * 4, 0, 0);

        eb0.setVelocity(b0.x, b0.y)
        eb1.setVelocity(b1.x, b1.y)
        eb2.setVelocity(b2.x, b2.y)
    }
}

