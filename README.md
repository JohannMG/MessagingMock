# MessagingMock

Mocks the API endpoints at `/api/v1/customer/messages/`

Use `GET /api/v1/customer/messages/?offset=10&limit=100` before any other method for the test API to generate a 'mailbox' for the user. 

Afterwards all API endpoints are to spec. 

Spec does not yet show how HTML will formatted in JSON, so currently sends minified HTML that uses single quotes to not interfere with JSON standard double quotes.  


##Implemented: 

###Accounts
- Must use BASIC authentication to pass a mock API key. 
- API docs specify that all accounts fields are sent as string literals. 
- Returns random customerToken. Not actually valid.


**8.1 Create User Account**

If all fields valid strings and email validates as well returns successfully. Does not check numbers right now. 

To simulate a 404 response, send a memebership number of all zeros(0). 

To simulate a 409 response, send a zipcode of all zeros(0).

**8.2 Authenticate User**

If all required fields are strings, returns normal response.
 
To simulate incorrent login pass username as "failauth" or either password or username as empty strings.


###Messages 
8.7 Get Customer Messages
8.8 Get Customer Message
8.9 Update Customer Message
8.10 Delete Customer Message