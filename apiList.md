# DevTinder APIs
 
 ## authRouter
 - POST /signup
 - POST /login
 - POST /logout
 
 ## profileRouter
 - GET /profile/view
 - PATCH /profile/edit
 - PATCH /profile/password
 
 ## connectionRequestRouter
- POST /request/send/intereted/:userId
 - POST /request/review/ignored/:userId
 - POST /request/send/:status/:userId 
 
 ## userRouter
 - GET /user/connections
 - GET /user/requests
 - GET /user/feed - Gets you the profiles of other users on platform
 
 
 Status: ignored, interested, accepeted, rejected