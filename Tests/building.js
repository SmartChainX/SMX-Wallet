const _ = require('underscore');
const builder = require('electron-builder');
const del = require('del');
const exec = require('child_process').exec;
const fs = require('fs');
const gulp = require('gulp');
const options = require('../gulpfile.js').options;
const path = require('path');
const Q = require('bluebird');
const shell = require('shelljs');
const version = require('../package.json').version;


const type = options.type;
const applicationName = (options.wallet) ? 'ChainX Wallet ' : 'SMX';


gulp.task('clean-dist', (cb) => {
    return del([
        `./dist_${type}/**/*`,
        './meteor-dapp-wallet'
    ], cb);
});


gulp.task('copy-app-source-files', () => {
    return gulp.src([
        'node_modules/**/*',
        '!node_modules/electron/',
        '!node_modules/electron/**/*',
        './main.js',
        './clientBinaries.json',
        './modules/**',
        './tests/**/*.*',
        '!./tests/wallet/*',
        `./icons/${type}/*`,
        './sounds/*',

'customProtocols.js'
    ], {
        base: './'
    })
    .pipe(gulp.dest(`./dist_${type}/app`));
});


gulp.task('copy-build-folder-files', () => {
    return gulp.src([

`./icons/${type}/*`,
        './interface/public/images/dmg-background.jpg'
    ])
    .pipe(gulp.dest(`./dist_${type}/build`));
});


gulp.task('switch-production', (cb) => {
    fs.writeFile(`./dist_${type}/app/config.json`, JSON.stringify({
        production: true,        mode: type

}), cb);
});


gulp.task('bundling-interface', (cb) => {
    const bundle = (additionalCommands) => {
        exec(`cd interface \
            && meteor-build-client ${path.join('..', `dist_${type}`, 'app', 'interface')} -p "" \
            ${additionalCommands}`,
        (err, stdout) => {
            console.log(stdout);
            cb(err);
        });
    };

    if (type === 'wallet') {
        if (options.walletSource === 'local') {
            console.log('Use local wallet at ../meteor-dapp-wallet/app');
            bundle(`&& cd ../../meteor-dapp-wallet/app \
                && meteor-build-client ../../dist_${type}/app/interface/wallet -p ""`);
        } else {
         
                && cd meteor-dapp-wallet/app \
                && meteor-build-client ../../app/interface/wallet -p "" \
                && cd ../../ \
                && rm -rf meteor-dapp-wallet`);
        }
    } else {
        bundle();
    }
});


gulp.task('copy-i18n', () => {
    return gulp.src([
        './interface/i18n/*.*',
        './interface/project-tap.i18n'
    ], {
        base: './'
    })
    .pipe(gulp.dest(`./dist_${type}/app`));
});


gulp.task('build-dist', (cb) => {
    const appPackageJson = _.extend({}, require('../package.json'), {  // eslint-disable-line global-require
        name: applicationName.replace(/\s/, ''),
        productName: applicationName,
        description: applicationName,
        build: {
         
            asar: true,
            directories: {
                buildResources: '../build',
                output: '../dist'
            },
            linux: {
                category: 'WebBrowser',
                target: [
                    'zip',
                    'deb'
                ]
            },
            win: {
                target: [
                    'zip'
                ]
},
