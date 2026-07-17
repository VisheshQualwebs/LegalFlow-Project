const userController = require("../controllers/userController");
const authenticate = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

async function userRoutes(app) {
    app.get("/users", {
        preHandler: [authenticate, authorizeRoles("admin")]
    }, userController.list);

    app.get("/users/:id", {
        preHandler: [authenticate]
    }, userController.read);

    app.patch("/users/:id", {
        preHandler: [authenticate]
    }, userController.update);

    app.delete("/users/:id", {
        preHandler: [authenticate, authorizeRoles("admin")]
    }, userController.destroy);
}

module.exports = userRoutes;


/*  

=======auth======
POST   /auth/signup
POST   /auth/login
POST   /auth/logout
GET    /auth/profile

=====Users=======
GET    /users
GET    /users/:id
PATCH  /users/:id
DELETE /users/:id


======Admin=========
GET    /users
GET    /users/:id
PATCH  /users/:id
DELETE /users/:id

GET    /cases
GET    /cases/:id
PATCH  /cases/:id
DELETE /cases/:id


=========Client=====
POST   /cases
GET    /cases?clientId=<myId>
GET    /cases/:id
PATCH  /users/:id (self)
GET    /users/:id (self)

=======lawyer======
GET    /cases?lawyerId=<myId>
GET    /cases/:id
PATCH  /cases/:id (status update)
PATCH  /users/:id (self)
GET    /users/:id (self)

====Cases=========
POST   /cases
GET    /cases
GET    /cases/:id
PATCH  /cases/:id
DELETE /cases/:id


=====hearing=====
PATCH /cases/:id   <----lawyer

--------Client-------
GET /cases?upcoming=true
GET /cases?date=2026-08-20
GET /cases?month=8&year=2026
GET /cases?status=in_progress


*/