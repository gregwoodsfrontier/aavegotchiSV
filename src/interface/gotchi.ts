import { AssetType } from './assets'

export default class Gotchi extends Phaser.GameObjects.Sprite
{
    nrg?: number //energy
    agg?: number //aggressive
    spk?: number //spooky
    brn?: number //brian

    constructor(scene:Phaser.Scene, x: number, y: number)
    {
        super(scene, x, y, AssetType.Gotchi);
        this.scene.physics.world.enable(this);
        (this.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);
    }
    

    kill()
    {
        this.destroy()
    }
}