import PlayerBulletPool from "./playerBulletPool";

declare namespace Phaser.GameObjects
{
    interface GameObjectFactory
    {
        playerBulletPool(): PlayerBulletPool
    }
}