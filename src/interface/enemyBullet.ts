import { AssetType } from "./assets"

export class EnemyBullet extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene: Phaser.Scene)
    {
        super(scene, 0, 0, AssetType.EnemyBullet);
        //this.setScale(1.5)
    }

    kill()
    {
        this.destroy();
    }

    update()
    {
        if(this.y > 610)
        {
            this.destroy()
        }
    }
}