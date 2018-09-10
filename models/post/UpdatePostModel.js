const baseSchema = require('./baseSchema')
const BaseModel = require('../BaseModel')

class UpdatePostModel extends BaseModel {
  static get schema () {
    return {
      ...baseSchema
    }
  }
}

module.exports = UpdatePostModel
