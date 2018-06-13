let mix = require('laravel-mix');

mix
    .setPublicPath('public')
    .js('assets/js/app.js', 'public/app.js')
    .sass('assets/scss/app.scss', 'public/app.css');
