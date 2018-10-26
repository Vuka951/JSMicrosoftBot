// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityTypes, MessageFactory, CardFactory } = require('botbuilder');
const Pornsearch = require('pornsearch');

class MyBot {
    /**
   *
   * @param {ConversationState} conversation state object
   */
    constructor(conversationState) {
    // Creates a new state accessor property.
    // See https://aka.ms/about-bot-state-accessors to learn more about the bot state and state accessors.
        this.conversationState = conversationState;
        this.video = {};
    }
    async getVideo(category) {
        await Pornsearch.search(category)
            .videos()
            .then(gifs => { this.video = gifs[0]; });
    }

    async getRandom(category, randomPageNumber) {
        await Pornsearch.search(category)
            .videos(randomPageNumber)
            .then(gifs => { this.video = gifs; });
    }

    /**
   *
   * @param {TurnContext} on turn context object.
   */
    async onTurn(turnContext) {
    // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        if (turnContext.activity.type === ActivityTypes.Message) {
            if (turnContext.activity.text.toLowerCase().includes('pron') && turnContext.activity.text.toLowerCase().includes('random') && turnContext.activity.text.toLowerCase().includes('newlook')) {
                let args = turnContext.activity.text.toLowerCase().slice().trim().split(' ');
                let randomPageNumber = Math.floor(Math.random() * 10);
                let category = args.filter(arg => arg !== 'pron' && arg !== 'random' & arg !== 'newlook');
                await this.getRandom(category, randomPageNumber);
                console.log(category);
                let randomVideoNumber = Math.floor(Math.random() * this.video.length);
                let hero = MessageFactory.attachment(
                    CardFactory.heroCard(
                        `${ this.video[randomVideoNumber].title }`,
                        CardFactory.images([`${ this.video[randomVideoNumber].thumb }`]),
                        CardFactory.actions([
                            {
                                type: 'openUrl',
                                title: 'FAP NOW',
                                value: `${ this.video[randomVideoNumber].url }`
                            }
                        ])
                    )
                );
                await turnContext.sendActivity(hero);
            } else if (turnContext.activity.text.toLowerCase().includes('pron') && turnContext.activity.text.toLowerCase().includes('random')) {
                let args = turnContext.activity.text.toLowerCase().slice().trim().split(' ');
                let randomPageNumber = Math.floor(Math.random() * 10);
                let category = args.filter(arg => arg !== 'pron' && arg !== 'random');
                await this.getRandom(category, randomPageNumber);
                console.log(category);
                let randomVideoNumber = Math.floor(Math.random() * this.video.length);
                await turnContext.sendActivity(`${ this.video[randomVideoNumber].title } \n ${ this.video[randomVideoNumber].url }`);
            } else if (turnContext.activity.text.toLowerCase().includes('pron')) {
                let args = turnContext.activity.text.toLowerCase().slice().trim().split(' ');
                let category = args.filter(arg => arg !== 'pron');
                await this.getVideo(category);
                console.log(category);
                await turnContext.sendActivity(`${ this.video.title } \n ${ this.video.url }`);
            } else if (turnContext.activity.text.toLowerCase().includes('suicide')) {
                let hero = MessageFactory.attachment(
                    CardFactory.animationCard(
                        'Time to Kermit Suicide',
                        [
                            { url: 'https://media.tenor.com/images/dbb7ddffd0ae9d7d6444a7b8a2dcc07f/tenor.gif' }
                        ],
                        [],
                        {
                        }
                    )
                );
                await turnContext.sendActivity(hero);
            } else if (turnContext.activity.text.toLowerCase().includes('thonk')) {
                let thonks = ['https://steamuserimages-a.akamaihd.net/ugc/887630550045153287/7DD753A52C8BB98273532E12463385BE36E85968/', 'https://ih0.redbubble.net/image.475001962.5999/flat,550x550,075,f.jpg', 'https://pbs.twimg.com/profile_images/901628119995432961/6Hdx5uHB_400x400.jpg', 'https://i.stack.imgur.com/upmDW.png?s=328&g=1', 'https://cdn.drawception.com/images/panels/2018/3-16/QtXA3ZxDEq-10.png', 'https://i.redd.it/0hxskjvnn5d01.jpg', 'https://vignette.wikia.nocookie.net/anotsonormalday/images/e/e2/Thonk_a_doodle_doo.png/revision/latest?cb=20180211221537', 'https://pbs.twimg.com/profile_images/906752052528783360/0scZtyQr_400x400.jpg', 'https://cdn.drawception.com/images/panels/2018/5-23/RfmpjFELWY-2.png', 'https://art.pixilart.com/efc4a56a7a949bf.png', 'https://i.redd.it/bkf7qyln3ejz.jpg', 'https://ih1.redbubble.net/image.475001977.5999/mug,standard,x400,center-bg,ffffff.jpg', 'https://pbs.twimg.com/profile_images/940291612294316032/Yoa3XNM1_400x400.jpg', 'https://i.imgur.com/6tSja91.jpg', 'https://pbs.twimg.com/media/DTtSBHfUMAEqqIQ.jpg', 'https://i.imgur.com/C13Q508.jpg', 'https://i.redd.it/bfn4meslyim01.png'];
                let randomThonk = Math.floor(Math.random() * thonks.length);
                let hero = MessageFactory.attachment(
                    CardFactory.heroCard(
                        `Thonk`,
                        CardFactory.images([`${ thonks[randomThonk] }`])
                    )
                );
                await turnContext.sendActivity(hero);
            }
        }
        // Save state changes
        await this.conversationState.saveChanges(turnContext);
    }
}

module.exports.MyBot = MyBot;
