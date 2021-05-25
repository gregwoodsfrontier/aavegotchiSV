import { EnemyBullet } from "../enemyBullet";
import { Bullet } from "../bullet";
import { Kaboom } from "../kaboom";

export class AssetManager {
    bullets: Phaser.Physics.Arcade.Group;
    enemyBullets: Phaser.Physics.Arcade.Group;
    explosions: Phaser.Physics.Arcade.Group;

    constructor(private _scene: Phaser.Scene) {
        this.bullets = this._createBullets();
        this.enemyBullets = this._createEnemyBullets();
        this.explosions = this._createExplosions();
    }

    clearBullets() {
        this.enemyBullets.clear(true, true)
        this.bullets.clear(true, true)
    }

    reset() {
        this.explosions.clear(true, true)
        this._createEnemyBullets();
        this._createBullets();
    }

    private _createEnemyBullets(): Phaser.Physics.Arcade.Group {
        let enemyBullets = this._scene.physics.add.group({
            maxSize: 500,
            classType: EnemyBullet,
            runChildUpdate: true,
        });
        enemyBullets.setOrigin(0.5, 1);
        return enemyBullets;
    }

    private _createBullets(): Phaser.Physics.Arcade.Group {
        let bullets = this._scene.physics.add.group({
            maxSize: 40,
            classType: Bullet,
            runChildUpdate: true
        });
        bullets.setOrigin(0.5, 1);
        return bullets;
    }

    private _createExplosions(): Phaser.Physics.Arcade.Group {
        let explosions = this._scene.physics.add.group({
            maxSize: 50,
            classType: Kaboom,
            runChildUpdate: true
        });

        return explosions;
    }

}