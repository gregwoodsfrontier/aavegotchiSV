import { AssetType } from "./assets";
import { AnimationType } from "../interface/factory/animationFactory";

export class Gotchi extends Phaser.Physics.Arcade.Sprite
{   
    gotchi: Phaser.Physics.Arcade.Sprite
    constructor(scene: Phaser.Scene, _x: number, _y: number, _texture: string)
    {
        super(scene, _x, _y, _texture)
        this.gotchi = scene.physics.add.sprite(_x, _y, _texture);
        this.gotchi.setCollideWorldBounds(true);
        this.gotchi.setScale(1.2);
        this.gotchi.play(AnimationType.GotchiFly)
    }
    
}