import Hammer from 'hammerjs';
import verge from 'verge';

// Track this so we can make the items slide accurately.
let frameTime = 0;
let lastTime = 0;

const stack = document.querySelector('.stack');

class Item {
    constructor(item) {
        this.item = item;
        this.isDragging = false;
        this.x = 0;
        this.y = 0;
        this.velocityX = 0;
        this.velocityY = 0;
        this.rotation = Math.random() * 8 - 4;

        this.mc = new Hammer(this.item);
        this.mc.add(new Hammer.Pan({direction: Hammer.DIRECTION_ALL, threshold: 0}));
        this.mc.on('pan', (e) => this.pan(e));

        this.item.style.transform = `rotate(${this.rotation}deg)`;
    }

    pan(e) {
        if (!this.isDragging) {
            this.isDragging = true;

            this.velocityX = 0;
            this.velocityY = 0;

            items.forEach((item) => {
                item.item.style.zIndex = '0';
            });

            this.item.style.zIndex = '1';

            const transformStyle = this.item.style.transform;

            if (transformStyle) {
                [this.x, this.y] = getTranslate(this.item);
            }
        }

        this.item.style.transform = `translate(${e.deltaX + this.x}px, ${e.deltaY + this.y}px) rotate(${this.rotation}deg)`;

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

            this.item.style.transform = `translate(${this.velocityX + this.x}px, ${this.velocityY + this.y}px) rotate(${this.rotation}deg)`;
        }

        if(!verge.inViewport(this.item)) {
            this.velocityX = 0;
            this.velocityY = 0;
            this.x = 0;
            this.y = 0;
            this.rotation = Math.random() * 10 - 5;
            this.item.style.zIndex = '0';
            this.item.style.transform = `rotate(${this.rotation}deg)`;

            // Move item to the bottom.
            stack.insertBefore(this.item, stack.firstChild);
        }
    }
}

const items = [...document.querySelectorAll('.stack__item')].map((item) => {
    return new Item(item);
});

function update(now) {
    frameTime = now - lastTime;
    lastTime = now;

    items.forEach((item) => item.update());

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
