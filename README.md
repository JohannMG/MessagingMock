# MessagingMock

~Do not send anything confindetial to this testing API. It is not secure.~

Mocks the API endpoints for CCM App
 
##Implemented: 

###Accounts
- Must use BASIC authentication to pass a mock API key. 
- API docs specify that all accounts fields are sent as string literals. 
- Returns random customerToken. Not actually valid.


**8.1 Create User Account**

- If all fields valid strings and email validates as well returns successfully. Does not check numbers right now. 
- To simulate a 404 response, send a memebership number of all zeros(0). 
- To simulate a 409 response, send a zipcode of all zeros(0).

**8.2 Authenticate User**

- If all required fields are strings, returns normal response.
- To simulate incorrent login pass username as "failauth" or either password or username as empty strings.


###Messages
Uses Basic Auth base64(MockAPIToken + ":" + MockUserID)
If you need a new inbox to work with (all messages have been deleted) use a new UserID for a new mock inbox of messages
 
**8.7 Get Customer Messages**
- Must call this endpoint to establish a new "inbox" for that user id


8.8 Get Customer Message
- API Spec does not yet show how HTML will formatted in JSON, so currently sends minified HTML that uses single quotes to not interfere with JSON standard double quotes.     

8.9 Update Customer Message

8.10 Delete Customer Message


##Log

**0.3**
Added User Accounts endpoints

**0.2**
Changed message IDs to be 32-bit

**0.1**
Initial push to AWS with messages endpoints
  