import Phaser from 'phaser'

function blinkText(_scene: Phaser.Scene, _text: Phaser.GameObjects.Text, blinkDelay: number)
{
    if (_text.visible === true)
    {
        _scene.time.delayedCall(blinkDelay, () =>
        {
            _text.setVisible(false);
        }) 
    }
    else
    {
        _scene.time.delayedCall(blinkDelay, () =>
        {
            _text.setVisible(true);
        })
    }
}

export default blinkText