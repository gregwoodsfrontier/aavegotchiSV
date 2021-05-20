import { AssetType, SoundType } from './assets'
import { AnimationType } from './factory/animationFactory'
import { Kaboom } from "./kaboom"


// option : 2
interface sushiTypeType
{
    maxlife: number
    lives: number,
    sprite: string,
    score: number
}

export class Lv1Sushi extends Phaser.Physics.Arcade.Sprite implements sushiTypeType 
{
    maxlife = 1
    lives = 1
    sprite = AssetType.SushiLv1;
    score = 100

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
    score = 200

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
    score = 300

    constructor(scene: Phaser.Scene, x: number, y: number)
    {
        super(scene, x, y, AssetType.SushiLv3);
    }
}

