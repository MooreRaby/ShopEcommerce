'use strict';

const ObjectId = require('mongoose').Types.ObjectId;

class TokenRepository {
    constructor (model, identifier) {
        this.model = model;
        this.identifier = identifier; // 'user' for UserToken, 'shop' for ShopToken
    }

    async createOrUpdate({ id, publicKey, privateKey, refreshToken }) {
        try {
            const filter = { [ this.identifier ]: id };
            const update = {
                publicKey,
                privateKey,
                refreshTokensUsed: [],
                refreshToken
            };
            const options = { upsert: true, new: true };

            const tokens = await this.model.findOneAndUpdate(filter, update, options);
            return tokens ? tokens.publicKey : null;
        } catch (error) {
            throw new Error(error);
        }
    }

    async findById(id) {
        return await this.model.findOne({ [ this.identifier ]: new ObjectId(id) });
    }

    async deleteById(id) {
        return await this.model.deleteOne({ [ this.identifier ]: new ObjectId(id) });
    }

    async findByRefreshToken(refreshToken, used = false) {
        const filter = used ? { refreshTokensUsed: refreshToken } : { refreshToken };
        return await this.model.findOne(filter).lean();
    }
}

module.exports = TokenRepository;
