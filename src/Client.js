const jaczfetch = require('jaczfetch');
const Error = require('./ErrorHandler');

class Client {
    constructor(id, token) {
        this._id = id;
        this._token = token;

        if (typeof this._id != 'string') throw new TypeError('id must be a string');

        this._baseURL = 'https://api.discordbots.group/v1';
    }

    /**
     * Gets useful statistics about the list.
     * @memberOf Client
     * @returns {Promise} The returned data.
     * */
    getStats() {
        return new Promise((resolve, reject) => {
            jaczfetch.get(this._baseURL).then((stats) => {
                resolve(stats.body);
            }).catch((e) => {
                reject(new Error(e));
            })
        })
    }

    /**
    * Returns all bots on the site.
    * @memberOf Client
    * @returns {Promise} The returned data.
    * */

    getBots() {
        return new Promise((resolve, reject) => {
            jaczfetch.get(this._baseURL + '/bots').then((bots) => {
                resolve(bots.body);
            }).catch((e) => {
                reject(new Error(e));
            })
        })
    }

    /**
     * Returns information on the specified bot.
     * @memberOf Client
     * @return {Promise} The returned data.
     * @param {Number} id The bot id.
     */

    getBot(id) {
        if (typeof id != 'string') throw new TypeError('id must be a string');
        return new Promise((resolve, reject) => {
            jaczfetch.get(this._baseURL + '/bot/' + id).then((bot) => {
                resolve(bot.body);
            }).catch((e) => {
                reject(new Error(e));
            })
        })
    }

    /**
     * Returns information about the current bot.
     * @memberOf Client
     * @return {Promise} The returned data.
     */

    getCurrent() {
        return this.getBot(this._id);
    }

    /**
     * Posts server count to the website.
     * @memberOf Client
     * @return {Promise} The returned data.
     * @param {Number} count The server count.
     */

    updateCount(count) {
        if (typeof count != 'number') throw new TypeError('count must be a number');
        if (typeof this._token != 'string') throw new TypeError('token must be a string');

        return new Promise((resolve, reject) => {
            jaczfetch.post(this._baseURL + '/bot/' + this._id).send({ server_count: count }).set('Authorization', this._token).then((bot) => {
                resolve(bot.body);
            }).catch((e) => {
                reject(new Error(e));
            })
        })
    }

    /**
     * Returns all votes for the current bot.
     * @memberOf Client
     * @returns {Promise} The returned data.
     * */

    getVotes() {
        return new Promise((resolve, reject) => {
            jaczfetch.get(this._baseURL + '/bot/' + this._id + '/upvotes').set('Authorization', this._token).then((votes) => {
                resolve(votes.body.upvotes);
            }).catch((e) => {
                reject(new Error(e));
            })
        })
    }

    /**
     * Check if a user has voted for the bot
     * @memberOf Client
     * @returns {Promise} The returned data.
     * */

    hasVoted24(user) {
        if (typeof user != 'string') throw new TypeError('user must be a string');
        return new Promise((resolve, reject) => {
            jaczfetch.get(this._baseURL + '/bot/' + this._id + '/upvotes').set('Authorization', this._token).then((votes) => {
                votes.body.upvotes.forEach(vote => {
                    console.log(vote.user)
                    if (vote.user == user && vote.timestamp > Date.now() - 86400000) {
                        resolve(true)
                    }
                })
                setTimeout(function(){
                    resolve(false);
                }, 100);
            }).catch((e) => {
                reject(new Error(e));
            })
        })
    }
}

module.exports = Client;