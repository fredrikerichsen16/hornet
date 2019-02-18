let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let trainingSentencesSchema = new Schema({
    intent: {
        type: Schema.Types.ObjectId,
        ref: 'Intent'
    },

    name: {
        type: String
    },

    scope: {
        global: Boolean,
        company_types: [{
            type: Schema.Types.ObjectId,
            ref: 'CompanyType'
        }],
        company: Schema.Types.ObjectId
    }
}, {
    collection: 'intents'
});

module.exports = mongoose.model('TrainingSentence', trainingSentencesSchema);
