import Phaser from 'phaser'
import WebFontFile from '../scenes/webFontFile'

const retro = {
    fontFamily: '"Press Start 2P"', 
    fontSize: '30px'
}  

export class myGame  extends Phaser.Scene 
{
    private active?: boolean;
    private config = {
        width: 800,
        height: 600,
    }
    
    //player properties
    private scoreText?: Phaser.GameObjects.Text;
    private player?: Phaser.Physics.Arcade.Image;
    private score?: number
    private playerBall?: Phaser.Physics.Arcade.Group;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    private alive?: number;
    private livesText?: Phaser.GameObjects.Text;

    //enmey properties
    private enemies?: Phaser.Physics.Arcade.Group;  
    private enemyBall?: Phaser.Physics.Arcade.Group;   
    private enemyVelocity: number = 1;
    private enBallLoop?: Phaser.Time.TimerEvent;
    private leftMostEnemy?: Phaser.GameObjects.GameObject;
    private rightMostEnemy?: Phaser.GameObjects.GameObject;

    gameOverText ()
    {
        this.add.text(
            this.config.width*0.5,
            -110,
            'Game Over',
            retro
        ).setOrigin(0.5, 0);

        this.add.text(
            this.config.width*0.5,
            -10,
            'Hit SPACE to restart',
            retro
        ).setOrigin(0.5, 0);
    }

    winText ()
    {
        this.add.text(
            this.config.width*0.5,
            -110,
            'You WIN !!!',
            retro
        ).setOrigin(0.5, 0);

        this.add.text(
            this.config.width*0.5,
            -10,
            'Hit SPACE to restart',
            retro
        ).setOrigin(0.5, 0);
    }

    genEnemyArray = (colNo: number, rowNo: number) =>
    {
        for (let yVal: number = 1; yVal < rowNo+1; yVal++)
        {
            for (let xVal: number = 1; xVal < colNo+1; xVal++)
            {
                this.enemies?.create(60 + 100*xVal, 20 + 50*yVal, 'enemy').setScale(0.25);
            }
        }
    }

    numOfTotalEnemies = () => 
    {
        const totalEnemies = this.enemies?.getChildren().length;
        return totalEnemies;
    }

    /* sortedEnemies = () => 
    {
        const orderedByXCoord = this.enemies?.getChildren().sort((a, b) => a.x - b.x);
        return orderedByXCoord;
    } */

    updateScore = () =>
    {
        this.scoreText?.setText(`Score: ${this.score}`)
    }
    
    genEnemyBall = () => 
    {
        let randomBug = Phaser.Utils.Array.GetRandom(this.enemies?.getChildren()!);
        this.enemyBall?.create(randomBug?.x, randomBug?.y, 'enemyBall');
        this.enemyBall?.setVelocityY(300);
    }

    setBG()
    {
        this.add.image(400, 150, 'galaxy').setScale(0.4, 0.4);
        this.add.image(400, 450, 'galaxy').setScale(0.4, 0.4);
        this.add.rectangle(0, 0, 800, 50, 0x000000).setOrigin(0, 0);
        this.scoreText = this.add.text(10, -310, `Score: 0`, retro) 
        .setOrigin(0, 0);
        this.livesText = this.add.text(790, -310, `Lives: 3`, retro)
        .setOrigin(1, 0);

        
    }

    enBallHit = (player, enemyBall) =>
    {
        enemyBall.disableBody(true, true);
        if (this.alive! > 1)
        {
            this.alive! -= 1;
            this.livesText?.setText(`Lives: ${this.alive}`)
        }
        else
        {
            this.livesText?.setText(`Lives: 0`)
            this.active = false;
            this.physics.pause();
            this.enBallLoop?.destroy();
            this.enemyVelocity = 1;
            // Click to restart
            this.gameOverText();
            this.input.keyboard.once('keydown-SPACE', () =>
            {
                this.scene.restart();
            }) 
        }
    }

    playerInputs ()
    {
        if(this.cursors?.left.isDown) 
        {
            this.player?.setVelocityX(-200);
            //this.player.anims.play('left', true);
        }
        else if (this.cursors?.right.isDown)
        {
            this.player?.setVelocityX(200);
            //this.player.anims.play('right', true);
        }
        else
        {
            this.player?.setVelocityX(0);
            //player.anims.play('turn');
        }

        if (Phaser.Input.Keyboard.JustDown(this.cursors!.space))
        {
            this.playerBall?.create(this.player?.x, this.player?.y, 'playerBall').setGravityY(-400).setVelocityY(-200)
        }
    }

    constructor()
    {
        super('mygame');
    }

    preload()
    {
        this.load.image('galaxy', 'assets/galaxyBG.png');
        this.load.image('player', 'assets/aavegotchialpha.png');
        this.load.image('enemy', 'assets/sushi-en.svg');
        this.load.image('playerBall', 'assets/playerBall.png');
        this.load.image('enemyBall', 'assets/enemyBall.png');
        this.load.addFile(new WebFontFile(this.load, 'Press Start 2P'))
    }


    create()
    {
        this.active = true;
        this.score = 0;
        this.alive = 3;

        this.input.on(
            'pointerup', () =>
            {
                if (this.active === false)
                {
                    this.scene.restart();
                }
            }
        )
              
        // Add background image
        this.setBG();

        // Add player and physics of player
        this.player = this.physics.add.image(400, 525, 'player').setScale(0.07, 0.07);
        this.player.setCollideWorldBounds(true);
        // Add control to player
        this.cursors = this.input.keyboard.createCursorKeys();
        //Player fires back
        this.playerBall = this.physics.add.group();

        this.enemies = this.physics.add.group();
        this.genEnemyArray(5,4);
               
        // Enemy fires
        this.enemyBall = this.physics.add.group();
        this.enBallLoop = this.time.addEvent(
            {
                delay:1000,
                callback: this.genEnemyBall,
                callbackScope: this,
                loop: true
            }
        )

        this.physics.add.collider(this.enemies, this.playerBall, (enemies, playerBall) => {
            enemies.destroy();
            playerBall.destroy();
            this.score! += 10;
            this.updateScore();
        })

        // if enemyBall hits player, the game stops.
        this.physics.add.overlap(this.player, this.enemyBall, this.enBallHit, undefined, this) 
    }

    update()
    {
        if (this.active)
        {
            this.playerInputs();
            

            if (this.numOfTotalEnemies() === 0)
            {
                this.active = false;
                this.physics.pause();
                this.enBallLoop?.destroy();
                this.enemyVelocity = 1;
                this.winText();
                // Restart event
                this.input.keyboard.once('keydown-SPACE', () =>
                {
                    this.scene.restart();
                })    
                

            } else {
            
                /* this.enemies?.getChildren().forEach(ene => {
                        const en = ene as Phaser.GameObjects.GameObject;
                        en.x += this.enemyVelocity;
                    }
                );
                this.leftMostEnemy = this.sortedEnemies()![0];
                this.rightMostEnemy = this.sortedEnemies()![this.sortedEnemies()!.length-1];
 
                if(this.leftMostEnemy.x < this.config.width*0.1 || this.rightMostEnemy.x > this.config.width*0.9) 
                {
                    this.enemyVelocity *= -1;
                    this.enemies?.getChildren().forEach(enemy => {enemy.y += 10 });
                } */
            }
        }
    }
}

export default myGame