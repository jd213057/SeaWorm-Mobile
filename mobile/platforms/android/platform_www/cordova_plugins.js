cordova.define('cordova/plugin_list', function (require, exports, module) {
    module.exports = [
        {
            id: 'es6-promise-plugin.Promise',
            file: 'plugins/es6-promise-plugin/www/promise.js',
            pluginId: 'es6-promise-plugin',
            runs: true,
        },
        {
            id: 'cordova-plugin-screen-orientation.screenorientation',
            file:
                'plugins/cordova-plugin-screen-orientation/www/screenorientation.js',
            pluginId: 'cordova-plugin-screen-orientation',
            clobbers: ['cordova.plugins.screenorientation'],
        },
        {
            id: 'cordova-plugin-device.device',
            file: 'plugins/cordova-plugin-device/www/device.js',
            pluginId: 'cordova-plugin-device',
            clobbers: ['device'],
        },
        {
            id: 'cordova-plugin-background-mode.BackgroundMode',
            file:
                'plugins/cordova-plugin-background-mode/www/background-mode.js',
            pluginId: 'cordova-plugin-background-mode',
            clobbers: [
                'cordova.plugins.backgroundMode',
                'plugin.backgroundMode',
            ],
        },
        {
            id: 'cordova-plugin-splashscreen.SplashScreen',
            file: 'plugins/cordova-plugin-splashscreen/www/splashscreen.js',
            pluginId: 'cordova-plugin-splashscreen',
            clobbers: ['navigator.splashscreen'],
        },
    ]
    module.exports.metadata = {
        'cordova-plugin-whitelist': '1.3.4',
        'es6-promise-plugin': '4.2.2',
        'cordova-plugin-screen-orientation': '3.0.2',
        'cordova-plugin-vibration': '3.1.1',
        'cordova-plugin-device': '2.0.3',
        'cordova-plugin-background-mode': '0.7.3',
        'cordova-plugin-splashscreen': '6.0.0',
    }
})
