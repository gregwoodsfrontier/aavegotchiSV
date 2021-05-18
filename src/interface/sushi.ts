import { AssetType, SoundType } from './assets'
import { AnimationType } from './factory/animationFactory'
import { Kaboom } from "./kaboom"


// option : 2
interface sushiTypeType
{
    maxlife: number
    lives: number,
    sprite: string,
}

export class Lv1Sushi extends Phaser.Physics.Arcade.Sprite implements sushiTypeType 
{
    maxlife = 1
    lives = 1
    sprite = AssetType.SushiLv1;

    constructor(scene: Phaser.Scene, x: number, y: number)
    {
        super(scene, x, y, AssetType.SushiLv1);
    }

}

export class Lv2Sushi extends Phaser.Physics.Arcade.Sprite implements sushiTypeType 
{
    maxlife = 2;
    lives = 2;
    sprite = AssetType.SushiLv2;

    constructor(scene: Phaser.Scene, x: number, y: number)
    {
        super(scene, x, y, AssetType.SushiLv2);
    }

}

export class Lv3Sushi extends Phaser.Physics.Arcade.Sprite implements sushiTypeType 
{
    maxlife = 3
    lives = 3;
    sprite = AssetType.SushiLv3;

    constructor(scene: Phaser.Scene, x: number, y: number)
    {
        super(scene, x, y, AssetType.SushiLv3);
    }



}

