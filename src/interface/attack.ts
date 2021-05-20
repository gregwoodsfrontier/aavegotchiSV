import {AssetManager} from '../interface/manager/assetManager'

export class AttackFunc
{
    constructor(private _scene: Phaser.Scene)
    {

    }

    singleShot(bullet: Phaser.Physics.Arcade.Sprite, gotchi: Phaser.Physics.Arcade.Sprite)
    {
        bullet.setScale(2)
        this._scene.physics.moveToObject(bullet, gotchi, 200);
    }

    radiantShot(bullet: Phaser.Physics.Arcade.Sprite, gotchi: Phaser.Physics.Arcade.Sprite,
        _x: number, _y: number)
    {
        let shotArr = [bullet, bullet, bullet];
        let angle0 = this._scene.physics.moveToObject(bullet, gotchi, 250)
        const dangle = 0.375;
        
        for (let i=0; i<shotArr.length; i++)
        {
            let ebangle = angle0 + dangle*(i-1)
            shotArr[i].setPosition(_x, _y)
            shotArr[i].setScale(3)
            shotArr[i].setVelocity(250 * Math.cos(ebangle), 250 * Math.sin(ebangle))
        }
    }
}