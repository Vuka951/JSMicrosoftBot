// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityTypes, MessageFactory, CardFactory } = require('botbuilder');
// Turn counter property
const TURN_COUNTER_PROPERTY = 'turnCounterProperty';
const Pornsearch = require('pornsearch');
class MyBot {
    /**
   *
   * @param {ConversationState} conversation state object
   */
    constructor(conversationState) {
    // Creates a new state accessor property.
    // See https://aka.ms/about-bot-state-accessors to learn more about the bot state and state accessors.
        this.countProperty = conversationState.createProperty(TURN_COUNTER_PROPERTY);
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
            // const hero = MessageFactory.attachment(
            //     CardFactory.heroCard(
            //         'Holler Back Buttons',
            //         ['https://example.com/whiteShirt.jpg'],
            //         [{
            //             type: ActionTypes.ImBack,
            //             title: 'ImBack',
            //             value: 'You can ALL hear me! Shout Out Loud'
            //         },
            //         {
            //             type: ActionTypes.PostBack,
            //             title: 'PostBack',
            //             value: 'Shh! My Bot friend hears me. Much Quieter'
            //         },
            //         {
            //             type: ActionTypes.OpenUrl,
            //             title: 'OpenUrl',
            //             value: 'https://en.wikipedia.org/wiki/{cardContent.Key}'
            //         }]
            //     )
            // );

            // await turnContext.sendActivity(hero);
            if (turnContext.activity.text.toLowerCase().includes('pron') && turnContext.activity.text.toLowerCase().includes('random')) {
                let args = turnContext.activity.text.toLowerCase().slice().trim().split(' ');
                let randomPageNumber = Math.floor(Math.random() * 10);
                let category = args.filter(arg => arg !== 'pron' && arg !== 'random');
                await this.getRandom(category, randomPageNumber);
                console.log(this.video);
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
            }
            // await turnContext.sendActivity(porn[0].webm);
            // read from state.
            // if (turnContext.activity.text.includes('?') || turnContext.activity.text.includes('gay')) {
            //     if (Math.floor(Math.random() * 10) > 7) await turnContext.sendActivity(`no u`);
            // }
            // let count = await this.countProperty.get(turnContext);
            // count = count === undefined ? 1 : ++count;
            // await turnContext.sendActivity(`${ count }: You said "${ turnContext.activity.text }"`);
            // // increment and set turn counter.
            // await this.countProperty.set(turnContext, count);
        }
        // Save state changes
        await this.conversationState.saveChanges(turnContext);
    }
}

module.exports.MyBot = MyBot;
