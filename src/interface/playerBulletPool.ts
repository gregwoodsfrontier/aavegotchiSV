import Phaser from 'phaser'
import {AssetType} from '../interface/assets'

const KEY_PLAYER_BULLET = 'bullet'


class PlayerBullet extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene: Phaser.Scene, x: number, y: number, key: string)
    {
        super(scene, x, y, AssetType.Bullet)
    }
}

export default class PlayerBulletPool extends Phaser.GameObjects.Group
{
    constructor(scene: Phaser.Scene, config: Phaser.Types.GameObjects.Group.GroupConfig = {})
    {
        const defaults: Phaser.Types.GameObjects.Group.GroupConfig = {
            classType: PlayerBullet,
            maxSize: -1
        }

        super(scene, Object.assign(defaults, config))
    }

    spawn(x = 0, y = 0, key: string = AssetType.Bullet)
    {
        const spawnExisting = this.countActive(false) > 0
        const pBullet: PlayerBullet = super.get(x, y, key)

        if (!pBullet)
        {
            return
        }

        if (spawnExisting)
        {
            pBullet.enableBody(true, x, y, true, true)
            pBullet.setVisible(true)
            pBullet.setActive(true)
        }

        return pBullet
    }

    despawn(pBullet: PlayerBullet)
    {
        pBullet.disableBody(true, true)
        pBullet.removeInteractive()
        pBullet.setActive(false)
        pBullet.setVisible(false)
    }

    initializeWithSize(size: number)
	{
		if (this.getLength() > 0 || size <= 0)
		{
			return
		}

		this.createMultiple({
			key: AssetType.Bullet,
			quantity: size,
			visible: false,
			active: false
		})
	}
}

Phaser.GameObjects.GameObjectFactory.register('playerBulletPool', function () {
	// @ts-ignore
	return this.updateList.add(new PlayerBulletPool(this.scene));
})

export {
	KEY_PLAYER_BULLET
}
