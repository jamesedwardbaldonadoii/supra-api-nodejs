const { RequestRule, errorCodes, ErrorWrapper } = require('supra-core')
const BaseAction = require('../BaseAction')
const UserModel = require('../../models/UserModel')
const UserDAO = require('../../dao/UserDAO')
const { jwtHelper } = require('../../auth')
const config = require('../../config')
const logger = require('../../logger')

class ConfirmRegistrationAction extends BaseAction {
  static get accessTag () {
    return 'users:confirm-registration'
  }

  static get validationRules () {
    return {
      body: {
        emailConfirmToken: new RequestRule(UserModel.schema.emailConfirmToken, { required: true })
      }
    }
  }

  static async run (ctx) {
    const tokenData = await jwtHelper.verify(ctx.body.emailConfirmToken, config.token.emailConfirm.secret)
    const { sub: userId } = tokenData

    const user = await UserDAO.baseGetById(userId)
    if (user.emailConfirmToken !== ctx.body.emailConfirmToken) {
      throw new ErrorWrapper({ ...errorCodes.WRONG_EMAIL_CONFIRM_TOKEN })
    }

    await UserDAO.baseUpdate(userId, { isConfirmedRegistration: true, emailConfirmToken: null })
    logger.info('User registration is confirmed', { userId, ctx: this.name })

    return this.result({ message: `User ${userId} registration is confirmed` })
  }
}

module.exports = ConfirmRegistrationAction
