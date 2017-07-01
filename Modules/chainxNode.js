

const _ = global._;

const fs = require('fs');

const Q = require('bluebird');

const spawn = require('child_process').spawn;

const { dialog } = require('electron');


const Windows = require('./windows.js');

const Settings = require('./settings');

const log = require('./utils/logger').create('ChainXNode');

const logRotate = require('log-rotate');

const EventEmitter = require('events').EventEmitter;


const Sockets = require('./socketManager');

const ClientBinaryManager = require('./clientBinaryManager');

const DEFAULT_NODE_TYPE = 'smx';

const DEFAULT_NETWORK = 'main';

const UNABLE_TO_BIND_PORT_ERROR = 'unableToBindPort';


const UNABLE_TO_SPAWN_ERROR = 'unableToSpan';

const PASSWORD_WRONG_ERROR = 'badPassword';

const NODE_START_WAIT_MS = 3000;

/**

 * ChainX nodes manager.


*/

class ChainX extends EventEmitter {

    constructor() {

        super();




this.STATES = STATES;



        this._loadDefaults();



        this._node = null;


this._type = null;

        this._network = null;



        this._socket = Sockets.get('node-ipc', Settings.rpcMode);




this.on('data', _.bind(this._logNodeData, this));

    }



    get isOwnNode() {

        return !!this._node;


}



    get isExternalNode() {

        return !this._node;

    }




    get isIpcConnected() {

        return this._socket.isConnected;

    }




get type() {

        return this.isOwnNode ? this._type : null;

    }



    get network() {

        return this.isOwnNode ? this._network : null;

    }



    get chx() {

        return this._type === 'chx';

    }

/**

     * Stop node.

     *

     * @return {Promise}

     */

    stop() {

        if (!this._stopPromise) {

            return new Q((resolve, reject) => {

                if (!this._node) {

                    return resolve();

                }



                this.state = STATES.STOPPING;



                log.info(`Stopping existing node: ${this._type} ${this._network}`);



                this._node.stderr.removeAllListeners('data');

                this._node.stdout.removeAllListeners('data');

                this._node.stdin.removeAllListeners('error');

                this._node.removeAllListeners('error');

                this._node.removeAllListeners('exit');



                this._node.kill('SIGINT');



                // after some time just kill it if not already done so

                const killTimeout = setTimeout(() => {

                    if (this._node) {

                        this._node.kill('SIGKILL');

                    }

                }, 8000 /* 8 seconds */);



                this._node.once('close', () => {

                    clearTimeout(killTimeout);



                    this._node = null;



                    resolve();

                });

            })

                .then(() => {

                    this.state = STATES.STOPPED;

                    this._stopPromise = null;

                });

        } else {

            log.debug('Disconnection already in progress, returning Promise.');

        }



        return this._stopPromise;

    }





    getLog() {

        return Settings.loadUserData('node.log');

    }





    /**
     */

    _start(nodeType, network) {

        log.info(`Start node: ${nodeType} ${network}`);



        const isTestNet = (network === 'test');



        if (isTestNet) {

            log.debug('Node will connect to the test network');

        }



        return this.stop()

            .then(() => {

                return this.__startNode(nodeType, network)

                    .catch((err) => {

                        log.error('Failed to start node', err);



                        this._showNodeErrorDialog(nodeType, network);



                        throw err;

                    });

            })

            .then((proc) => {

                log.info(`Started node successfully: ${nodeType} ${network}`);



                this._node = proc;

                this.state = STATES.STARTED;



                Settings.saveUserData('node', this._type);

                Settings.saveUserData('network', this._network);



                return this._socket.connect(Settings.rpcConnectConfig, {

                    timeout: 30000, /* 30s */

                })

                    .then(() => {

                        this.state = STATES.CONNECTED;

                    })

                    .catch((err) => {

                        log.error('Failed to connect to node', err);



                        if (err.toString().indexOf('timeout') >= 0) {

                            this.emit('nodeConnectionTimeout');

                        }



                        this._showNodeErrorDialog(nodeType, network);



                        throw err;

                    });

            })

            .catch((err) => {

                // set before updating state so that state change event observers

                // can pick up on this

                this.lastError = err.tag;

                this.state = STATES.ERROR;



                // if unable to start chx node then write smx to defaults

                if (nodeType === 'chx') {

                    Settings.saveUserData('node', 'smx');

                }



                throw err;

            });

    }
