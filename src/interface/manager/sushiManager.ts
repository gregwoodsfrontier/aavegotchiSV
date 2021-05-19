import { Lv1Sushi, Lv2Sushi, Lv3Sushi} from "../sushi";
import { AnimationType } from "../factory/animationFactory";
import { AnimationFactory } from "../factory/animationFactory"
import { AssetType } from "../assets";
//import { Kaboom } from "../kaboom"
export class SushiManager {
    wave1 = [
        [3,3,3,3,3],
        [2,2,2,2,2],
        [1,1,1,1,1]
    ]
    animate = new AnimationFactory(this._scene)
    sushiarmy: Phaser.Physics.Arcade.Sprite[];
    lv1sushi: Phaser.Physics.Arcade.Group;
    lv2sushi: Phaser.Physics.Arcade.Group;
    lv3sushi: Phaser.Physics.Arcade.Group;

    private ORIGIN_X: number = 100
    private ORIGIN_Y: number = 100
    private dx: number = 100
    private dy: number = 60

    get noAliveSushis(): boolean {
        let noOfSushi = this.lv1sushi.getChildren().length + this.lv2sushi.getChildren().length + this.lv3sushi.getChildren().length

        return noOfSushi > 0 ? true: false;
    }

    constructor(private _scene: Phaser.Scene) {
        // lv1sushi add group
        this.lv1sushi = this._scene.physics.add.group(
            {
                maxSize: 40,
                classType: Lv1Sushi,
                runChildUpdate: true
            }
        );
        
        // lv2sushi add group
        this.lv2sushi = this._scene.physics.add.group(
            {
                maxSize: 40,
                classType: Lv2Sushi,
                runChildUpdate: true
            }
        );
        
        // lv3sushi add group
        this.lv3sushi = this._scene.physics.add.group(
            {
                maxSize: 40,
                classType: Lv3Sushi,
                runChildUpdate: true
            }
        );
        this.sushiarmy = this.sortSushiArmy(this.wave1)
        this._animate()
    }

    

    // get one single random enemy
    getRandomAliveEnemy()
    {   
        let _sushi1 = this.lv1sushi.children.getArray() as Phaser.Physics.Arcade.Sprite[]
        let _sushi2 = this.lv2sushi.children.getArray() as Phaser.Physics.Arcade.Sprite[]
        let _sushi3 = this.lv3sushi.children.getArray() as Phaser.Physics.Arcade.Sprite[]
        let livingSushi = [] as Phaser.Physics.Arcade.Sprite[]
        let _su = [_sushi1,_sushi2,_sushi3]

        for (let i = 0; i < _su.length; i++)
        {
            for (let j = 0; j < _su[i].length; j++)
            {
                
                livingSushi.push(_su[i][j])               
                
            }
        }
        let random = Phaser.Math.RND.integerInRange(0, livingSushi.length-1);
        return livingSushi[random];
    }

    reset() {
        this.sushiarmy = this.sortSushiArmy(this.wave1)
        this._animate();
    }

    private spawnSushiPosX(_numSushi: number)
    {
        let xPos = [] as number[]
        // _numSushi is number of Sushi going to spawn
        for (let i = 0; i < _numSushi; i++)
        {
            xPos.push(this.ORIGIN_X + i * this.dx)
            //xPos.push(this.ORIGIN_X + i * this.dx)
        }
        return xPos
    }

    // generate that sushi army
    private sortSushiArmy(_type: number[][])
    {
        let pushedSushi: Phaser.Physics.Arcade.Sprite;
        let _sushiarmy = new Array;
        for (let y = 0; y < _type.length; y++)
        {
            for (let x = 0; x < _type[y].length; x++)
            {
                switch (_type[y][x])
                {
                    case 1:                  
                        pushedSushi = this.lv1sushi.create(
                            this.ORIGIN_X + x * this.dx,
                            this.ORIGIN_Y + y * this.dy, 
                            AssetType.SushiLv1)
                        _sushiarmy.push(pushedSushi)
                        pushedSushi.play(AnimationType.Sushi1Fly)
                        break;

                    case 2:
                        pushedSushi = this.lv2sushi.create(
                            this.ORIGIN_X + x * this.dx,
                            this.ORIGIN_Y + y * this.dy, 
                            AssetType.SushiLv2)
                        _sushiarmy.push(pushedSushi)
                        pushedSushi.play(AnimationType.Sushi2Fly)
                        break;

                    case 3:
                        pushedSushi = this.lv3sushi.create(
                            this.ORIGIN_X + x * this.dx,
                            this.ORIGIN_Y + y * this.dy, 
                            AssetType.SushiLv3)
                        _sushiarmy.push(pushedSushi)
                        pushedSushi.play(AnimationType.Sushi3Fly)
                        break;
                    
                    default:
                        console.error('No such sushi')
                        break;
                }
            }
        }
        return _sushiarmy
    }

    // calling that infinity spawn of the sushi
    spawnSushi(_type: number[])
    {
        let pushedSushi: Phaser.Physics.Arcade.Sprite;
        let _sushiarmy = new Array;
        for (let x = 0; x < _type.length; x++)
        {
            let temp = this.spawnSushiPosX(_type.length)
            let posx = temp[x]
            switch (_type[x])
            {
                
                case 1:                 
                    pushedSushi = this.lv1sushi.create(posx, this.ORIGIN_Y, AssetType.SushiLv1)
                    _sushiarmy.push(pushedSushi)
                    pushedSushi.play(AnimationType.Sushi1Fly)
                    break;

                case 2:
                    pushedSushi = this.lv2sushi.create(posx, this.ORIGIN_Y, AssetType.SushiLv2)
                    _sushiarmy.push(pushedSushi)
                    pushedSushi.play(AnimationType.Sushi2Fly)
                    break;

                case 3:
                    pushedSushi = this.lv3sushi.create(posx, this.ORIGIN_Y, AssetType.SushiLv3)
                    _sushiarmy.push(pushedSushi)
                    pushedSushi.play(AnimationType.Sushi3Fly)
                    break;
                
                default:
                    console.error('No such sushi')
                    break;
            }
        }
        return _sushiarmy
    }

    makeTween(child)
    {
        this._scene.tweens.add(
            {
                targets: child,
                ease: "Linear",
                duration: 2000,
                x: "+=200",
                paused: false,
                delay: 0,
                yoyo: true,
                repeat: -1,
                onYoyo: (tween, targets, undefined) => {
                    
                    child.y += 25
                }
            }
        )
        
    }   

    _animate() {
        this.lv1sushi.getChildren().forEach(element => {
            this.makeTween(element)
        });
        this.lv2sushi.getChildren().forEach(element => {
            this.makeTween(element)
        });
        this.lv3sushi.getChildren().forEach(element => {
            this.makeTween(element)
        });
        
    }

    disableAllSushis()
    {
        this.lv1sushi.clear(true, true);
        this.lv2sushi.clear(true, true);
        this.lv3sushi.clear(true, true)
    }

}