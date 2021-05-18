import { AssetType } from "../assets";

export enum AnimationType
{
    GotchiFly = "gotchifly",
    Sushi1Fly = "sushi1fly",
    Sushi2Fly = "sushi2fly",
    Sushi3Fly = "sushi3fly",
    SushiBFly = "sushibfly",
    Kaboom = "kaboom"
}

export class AnimationFactory
{
    constructor(private _scene: Phaser.Scene)
    {
        this._init();
    }

    private _init()
    {
        // input for gotchi animation
        this._scene.anims.create(
            {
                key: AnimationType.GotchiFly,
                frames: this._scene.anims.generateFrameNumbers(
                    AssetType.Gotchi,
                    {
                        start: 0,
                        end: 3
                    }
                ),
                frameRate: 2,
                repeat: -1
            }
        )

        // input for sushiLv1 animation
        this._scene.anims.create(
            {
                key: AnimationType.Sushi1Fly,
                frames: this._scene.anims.generateFrameNumbers(
                    AssetType.SushiLv1,
                    {
                        start: 0,
                        end: 3
                    }),
                    frameRate: 2,
                    repeat: -1,
                    

            }
        )

        // input for sushiLv2 animation
        this._scene.anims.create(
            {
                key: AnimationType.Sushi2Fly,
                frames: this._scene.anims.generateFrameNumbers(
                    AssetType.SushiLv2,
                    {
                        start: 0,
                        end: 3
                    }),
                    frameRate: 2,
                    repeat: -1

            }
        )

        // input for sushiLv3 animation
        this._scene.anims.create(
            {
                key: AnimationType.Sushi3Fly,
                frames: this._scene.anims.generateFrameNumbers(
                    AssetType.SushiLv3,
                    {
                        start: 0,
                        end: 3
                    }),
                    frameRate: 2,
                    repeat: -1

            }
        )

        this._scene.anims.create(
            {
                key: AnimationType.Kaboom,
                frames: this._scene.anims.generateFrameNumbers(AssetType.Kaboom, {
                    start: 0,
                    end: 15
                }),
                frameRate: 24,
                repeat: 0,
                hideOnComplete: true
            }
        );
    }
}