import Hammer from 'hammerjs';
import verge from 'verge';

let frameTime = 0;
let lastTime = 0;

class Item {
    constructor(item) {
        this.item = item;
        this.isDragging = false;
        this.x = 0;
        this.y = 0;
        this.velocityX = 0;
        this.velocityY = 0;

        this.mc = new Hammer(this.item);

        this.mc.add(new Hammer.Pan({direction: Hammer.DIRECTION_ALL, threshold: 0}));

        this.mc.on('pan', (e) => this.pan(e));
    }

    pan(e) {
        if (!this.isDragging) {
            this.isDragging = true;

            this.velocityX = 0;
            this.velocityY = 0;

            const transformStyle = this.item.style.transform;

            if (transformStyle) {
                [this.x, this.y] = getTranslate(this.item);
            }
        }

        this.item.style.transform = `translate(${e.deltaX + this.x}px, ${e.deltaY + this.y}px)`;

        if (e.isFinal) {
            this.velocityX = e.velocityX * frameTime;
            this.velocityY = e.velocityY * frameTime;

            this.isDragging = false;
        }
    }

    update() {
        if (this.velocityX > 0) {
            this.velocityX -= this.velocityX / 30;
            if (this.velocityX < 0) this.velocityX = 0;
        } else if (this.velocityX < 0) {
            this.velocityX += Math.abs(this.velocityX / 30);
            if (this.velocityX > 0) this.velocityX = 0;
        }

        if (this.velocityY > 0) {
            this.velocityY -= this.velocityY / 30;
            if (this.velocityY < 0) this.velocityY = 0;
        } else if (this.velocityY < 0) {
            this.velocityY += Math.abs(this.velocityY / 30);
            if (this.velocityY > 0) this.velocityY = 0;
        }

        if (this.velocityX !== 0 || this.velocityY !== 0) {
            [this.x, this.y] = getTranslate(this.item);

            this.item.style.transform = `translate(${this.velocityX + this.x}px, ${this.velocityY + this.y}px)`;
        }

        if(!verge.inViewport(this.item)) {
            console.log('ey');
            this.velocityX = 0;
            this.velocityY = 0;
            this.x = 0;
            this.y = 0;
            this.item.style.transform = '';
        }
    }
}

const items = [...document.querySelectorAll('.stack__item')].map((item) => {
    return new Item(item);
});

function update(now) {
    items.forEach((item) => item.update());

    frameTime = now - lastTime;
    lastTime = now;

    window.requestAnimationFrame(update);
}

window.requestAnimationFrame(update);

// Source: https://gist.github.com/aderaaij/a6b666bf756b2db1596b366da921755d
function getTranslate(item) {
    const transArr = [];

    if (!window.getComputedStyle) return;
    const style = getComputedStyle(item),
        transform = style.transform || style.webkitTransform || style.mozTransform || style.msTransform;
    let mat = transform.match(/^matrix3d\((.+)\)$/);
    if (mat) return parseFloat(mat[1].split(', ')[13]);

    mat = transform.match(/^matrix\((.+)\)$/);
    mat ? transArr.push(parseFloat(mat[1].split(', ')[4])) : transArr.push(0);
    mat ? transArr.push(parseFloat(mat[1].split(', ')[5])) : transArr.push(0);

    return transArr;
}