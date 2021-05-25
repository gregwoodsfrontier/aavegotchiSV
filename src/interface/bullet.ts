import { AssetType, SoundType } from "./assets"

export class Bullet extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene: Phaser.Scene)
    {
        super(scene, -10, -10, AssetType.Bullet);
    }

    shoot(x:number, y:number)
    {
        //this.scene.sound.play(SoundType.Shoot)
        this.setPosition(x, y);
        this.setVelocityY(-400);
    }

    kill()
    {
        this.destroy();
    }

    update()
    {
        if (this.y < -50)
        {
            this.destroy()
        }
    }
}