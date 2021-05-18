import Phaser from 'phaser'
import {SceneKeys} from './consts/SceneKeys'
import TitleScene  from './scenes/titleScene'
import { GameScene } from './scenes/game';
import BackGround from './scenes/background';
import GameOverScene from './scenes/gameover';

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
    backgroundColor: '0x808080',
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 }
		}
	},
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH
	},

	
}

const game = new Phaser.Game(config)

game.scene.add(SceneKeys.TitleScene, TitleScene);
game.scene.add(SceneKeys.GameScene, GameScene);
game.scene.add(SceneKeys.BackGround, BackGround);
game.scene.add(SceneKeys.GameOverScene, GameOverScene);

game.scene.start(SceneKeys.GameOverScene);