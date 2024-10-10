# DevTinder Apis

authRouter 
-Post /signup
-Post /login
-Post /logout

profileRouter
-GET /profile/view
-patch/profile/edit
-patch /profile/password

-connectionRequest router
- Post /request/send/interested/:userId
- Post /request/send/ignored/:userId;
- Post /request/review/accepted/:requestId
- Post /request/review/rejected/:requestId

userRouter 
-GET /user/connections
- GET /user/requests
- GET /user/feed 