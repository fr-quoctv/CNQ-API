/**
 * AuthController
 *
 * @description :: Server-side logic for managing accounts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    postRegister: asyncWrap(async (req, res) => {
        const { username, passhash, type } = req.body;
        let { client_id } = req.body;

        client_id = `${client_id}:${Date.now()}`;
        console.log('test ci');
        // create user
        let userData = {
            username,
            passhash,
            client_id
        };

        let user = await vmq_acl_auth.create(userData);
        console.log(user);
        let acl = [];

        if (type === 'user') {
            acl.push({
                pattern: `${sails.config.parttent_acl_first}/${user._id}/user`
            });
            await vmq_acl_auth.findByIdAndUpdate(
                { _id: user._id },
                { publish_acl: acl, subscribe_acl: acl }
            );
        } else {
            acl.push({
                pattern: `${sails.config.parttent_acl_first}/${user._id}/driver`
            });

            await vmq_acl_auth.findByIdAndUpdate(
                { _id: user._id },
                { publish_acl: acl, subscribe_acl: acl }
            );
        }
        data = [];

        data.push({
            client_id,
            _id: user._id
        });

        res.ok({ data });
    })
};
