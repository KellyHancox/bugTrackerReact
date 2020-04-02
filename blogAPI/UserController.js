const UserDB = require('./UserDB');
const User = require('./User')

class UserController {

    async index(req, res) {     
        res.send(await UserDB.all())
    }

    async show(req, res) {
        let id = req.params.id;
        let user = await UserDB.find(id);

        if (!user) {
            res.send("Could not find toy with id of " + id);
        } else {
            res.send(user);
        }
    }

    async create(req, res) {
        console.log("About to create user");
        console.log(req.body);

        let newUser = req.body;

        // Quick and dirty validation
        if (User.isValid(newUser, await UserDB.all())) {
            // The 'data' contains the id (primary key) of newly created user
            UserDB.create(newUser).then(data => res.send(data));
        } else {
            // Send a 422 response.
            res.status(422);
            res.send({ message: newUser.errors.join(": ") });
        }
    }

    async update(req, res) {
        let newUser = req.body;
        console.log("Proposed update: ");
        console.log(newUser);
        let id = req.params.id;
        let user = await UserDB.find(id);

        if (!user) {
            res.status(404);
            res.send("Could not find an user with id of " + id);
        } else {
            if (User.isValid(newUser, await UserDB.all())) {
                // Indicate that the response is successful, but has no body.
                UserDB.update(newUser).then(() => {
                    res.status(204);
                    res.send();
                });
            } else {
                // Send a 422 response.
                res.status(422);
                res.send({ message: newUser.errors.join(": ") });
            }
        }
    }

    async delete(req, res) {
        let id = req.params.id;
        let user = await UserDB.find(id);
        if (!user) {
            res.status(404);
            res.send("Could not find toy with id of " + id);
        } else {
            UserDB.delete(user).then(() => {
                res.status(204);
                res.send();
            }).catch((message) => {
                res.status(500);
                res.send("Server error: " + message);
            });
        }
    } // end delete
}
module.exports = UserController;