// const jwt = require("jsonwebtoken");
// const Router = require("express").Router;
// const router = new Router();
// const {ensureLoggedIn, ensureCorrectUser} = require("../middleware/auth");

// const Message = require("../models/messages");
// const {SECRET_KEY} = require("../config");
// const ExpressError = require("../expressError");


// router.get("/message", async function (req, res, next) {
//     try {
//       let message = await Message.get(req.params.id);
//       return res.json({message});
//     }
//     catch (err) {
//       return next(err);
//     }
//   });
  

// router.post("/message", async function (req, res, next) {
//     try {
//         let {from_username, to_username, body} == req.body
//       let message = await Message.create(req.params.id);
//       return res.json({message});
//     }
//     catch (err) {
//       return next(err);
//     }
//   });
  




// /** GET /:id - get detail of message.
//  *
//  * => {message: {id,
//  *               body,
//  *               sent_at,
//  *               read_at,
//  *               from_user: {username, first_name, last_name, phone},
//  *               to_user: {username, first_name, last_name, phone}}
//  *
//  * Make sure that the currently-logged-in users is either the to or from user.
//  *
//  **/


// /** POST / - post message.
//  *
//  * {to_username, body} =>
//  *   {message: {id, from_username, to_username, body, sent_at}}
//  *
//  **/


// /** POST/:id/read - mark message as read:
//  *
//  *  => {message: {id, read_at}}
//  *
//  * Make sure that the only the intended recipient can mark as read.
//  *
//  **/

