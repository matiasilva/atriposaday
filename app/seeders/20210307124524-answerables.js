'use strict';

const fs = require('fs');
const path = require('path');
const utils = require('../utils');
const { nanoid } = require("nanoid");
const Answerable = require('../models/answerable');
const AnswerablesTopics = require('../models/answerablestopics');

module.exports = {
    up: async (queryInterface, Sequelize) => {

        // the path to all the cropped images
        const rootFolderPath = path.join(__dirname, '../../', 'cropped');

        // grab array of all module names
        const subjects = fs.readdirSync(rootFolderPath);

        for (const subject of subjects) {
            // grap the topic with name equal to value of module name
            const rootTopic = await queryInterface.rawSelect('topics', {
                where:
                {
                    parentId: null,
                    name: subject
                }
            }, ['id']);

            // read contents of the module folder and get all years
            const years = fs.readdirSync(path.join(rootFolderPath, subject));

            for (const year of years) {
                // get all the image names in the year folder
                const files = fs.readdirSync(path.join(rootFolderPath, subject, year));

                // find the paper belonging to this year and subject combo
                const paperId = await queryInterface.rawSelect('papers', {
                    where:
                    {
                        year,
                        subject,
                    }
                }, ['id']);

                // now for each file in the year folder
                for (const fileName of files) {
                    // capture groups from file name
                    const fileNameMatch = utils.matchFileName(fileName);
                    // just in case
                    if (!fileNameMatch) throw new Error('Submission included invalid file names');

                    // generate name so we can use it later
                    const questionImageName = `${nanoid()}.${fileNameMatch[fileNameMatch.length - 1]}`;

                    // copy the file to the static/uploads path
                    fs.copyFileSync(path.join(rootFolderPath, subject, year, fileName), path.join(__dirname, '../../', 'static', 'uploads', questionImageName));

                    // convert captured groups into numbers
                    const args = fileNameMatch.slice(1, 3).filter(str => str).map(str => parseInt(str));

                    // create answerable model with the question and paper number
                    const answerable = await queryInterface.bulkInsert('answerables', [{
                        paperId,
                        number: args[0],
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }]);

                    const answerableId = await queryInterface.rawSelect('answerables', {
                        where:
                        {
                            paperId,
                            number: args[0]
                        }
                    }, ['id']);

                    // array for list of assets to add
                    const assetRecords = [];

                    if (args.length === 1) {
                        // just the question, no further assets
                        assetRecords.push({
                            path: `/static/uploads/${questionImageName}`,
                            answerableId,
                            isMainAsset: true,
                            createdAt: new Date(),
                            updatedAt: new Date()
                        });
                    } else if (args.length === 2 && !isNaN(args[1])) {
                        // a question's supporting material: graphs, etc
                        assetRecords.push({
                            path: `/static/uploads/${questionImageName}`,
                            answerableId,
                            isMainAsset: false,
                            createdAt: new Date(),
                            updatedAt: new Date()
                        });
                    } else {
                        // should implement this part
                        // if (created) {
                        //     await question.destroy();
                        // }
                        throw new Error('Invalid input image name');
                    }

                    await queryInterface.bulkInsert('answerables_topics', [{
                        topicId: rootTopic,
                        answerableId,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }]);

                    await queryInterface.bulkInsert('assets', assetRecords);
                }

            }
        }
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('answerables', null, {});
    }
};
