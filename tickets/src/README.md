# Ticket Microservice
This microservices deals with creating, updating, and retrieivng all tickets. 

## process.env.JWT_KEY
JWT_KEY is needed for decoding the web token.
I have applied it via a secret in kubernetes.  

JWT_KEY is defined in src/test/setup.ts for testing.

#### Set-Cookie global signin() function
The global signin() function has been changed to create a new ObjectId on every call. The reason for this is to simulate
 a user trying to update a ticket which is not theirs in src/routes/__test__/updateticket.test.ts.