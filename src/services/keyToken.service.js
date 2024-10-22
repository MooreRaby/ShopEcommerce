'use strict';

const { UserToken, ShopToken } = require('../models/keytoken.model');
const TokenRepository = require('../models/repositories/token.repo');

class KeyTokenService {
    constructor () {
        this.userTokenRepo = new TokenRepository(UserToken, 'user');
        this.shopTokenRepo = new TokenRepository(ShopToken, 'shop');
    }

     async createUserToken({id, publicKey, privateKey, refreshToken}) {
        return this.userTokenRepo.createOrUpdate({id, publicKey, privateKey, refreshToken});
    }


     async createShopToken(params) {
        return this.shopTokenRepo.createOrUpdate(params);   
    }

     async findByUserId(userId) {
        return this.userTokenRepo.findById(userId);
    }

     async findByShopId(shopId) {
        return this.shopTokenRepo.findById(shopId);
    }

     async deleteUserKeyById(userId) {
        return this.userTokenRepo.deleteById(userId);
    }

     async deleteShopKeyById(shopId) {
        return this.shopTokenRepo.deleteById(shopId);
    }

     async findUserByRefreshToken(refreshToken, used = false) {
        return this.userTokenRepo.findByRefreshToken(refreshToken, used);
    }

     async findShopByRefreshToken(refreshToken, used = false) {
        return this.shopTokenRepo.findByRefreshToken(refreshToken, used);
    }
}

module.exports = new KeyTokenService();
