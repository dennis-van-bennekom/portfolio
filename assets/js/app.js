const items = document.querySelectorAll('.stack__item');

let mouseX = 0;
let mouseY = 0;
let itemX = 0;
let itemY = 0;
let mouseDown = false;
let selectedItem = null;

items.forEach((item) => {
    item.addEventListener('mousedown', (e) => {
        selectedItem = e.target;
        mouseDown = true;

        mouseX = e.clientX;
        mouseY = e.clientY;

        const transformStyle = selectedItem.style.transform;

        if (transformStyle) {
            [itemX, itemY] = getTranslate(selectedItem);
        } else {
            itemX = selectedItem.offsetLeft;
            itemY = selectedItem.offsetTop;
        }
    });

    window.addEventListener('mouseup', (e) => {
        mouseDown = false;
        selectedItem = null;
    });

    window.addEventListener('mousemove', (e) => {
        if (mouseDown && selectedItem) {
            const deltaX = e.clientX - mouseX + itemX;
            const deltaY = e.clientY - mouseY + itemY;

            selectedItem.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        }
    });
});

// Source: https://gist.github.com/aderaaij/a6b666bf756b2db1596b366da921755d
function getTranslate(item) {
    const transArr = [];

    if (!window.getComputedStyle) return;
    const style     = getComputedStyle(item),
        transform = style.transform || style.webkitTransform || style.mozTransform || style.msTransform;
    let mat       = transform.match(/^matrix3d\((.+)\)$/);
    if (mat) return parseFloat(mat[1].split(', ')[13]);

    mat = transform.match(/^matrix\((.+)\)$/);
    mat ? transArr.push(parseFloat(mat[1].split(', ')[4])) : transArr.push(0);
    mat ? transArr.push(parseFloat(mat[1].split(', ')[5])) : transArr.push(0);

    return transArr;
}