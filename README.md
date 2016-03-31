# MessagingMock

~Do not send anything confidential to this testing API. It is not secure.~

Mocks the API endpoints for CCM App




 ##App Menu Content
 
 **TODO: Get Content**
 <br/>_GET /api/{v1}/content/{id e.g., 'MyAAA'}_ 
 
 
##Accounts
Must use BASIC authentication to pass a mock API key. base64(APIKEY)
 
API docs specify that all accounts fields are sent as string literals.
 
Returns random customerToken. Not actually valid.


**Create User Account**
<br/>_POST /api/{v1}/authentication_

- If all fields valid strings and email validates as well returns successfully. Does not check numbers right now. 
- To simulate a 404 response, send a memebership number of all zeros(0). 
- To simulate a 409 response, send a zipcode of all zeros(0).

**Authenticate User**
<br/>_PUT /api/{v1}/authentication_

- If all required fields are strings, returns normal response.
- To simulate incorrent login pass username as "failauth" or either password or username as empty strings.

List of Username / Password that can authenticate
- kodak@aaa.com / kodak
- fuji@aaa.com / fuji 
- imax@aaa.com / imax
- arri@aaa.com / arri
- cooke@aaa.com / cooke
- please* / *  (wildcard login) 

**TODO: Get User Authentication**
<br/>_GET /api/{v1}/authentication_

**TODO: Update Customer**
<br/>_PUT /api/{v1}/customer_

**TODO: Get Customer**
<br/>_GET /api/{v1}/customer_


##Messages
Uses Basic Auth base64(MockAPIToken + ":" + MockUserID)
If you need a new inbox to work with (all messages have been deleted) use a new UserID for a new mock inbox of messages
 
**Get Customer Messages**
<br/>_GET /api/{v1}/customer/messages?offset={positive_integer}&limit={positive_integer}_

- Must call this endpoint to establish a new "inbox" for that user id


**Get Customer Message**
<br/>_GET /api/{v1}/customer/messages/{id}_

- API Spec does not yet show how HTML will formatted in JSON, so currently sends minified HTML that uses single quotes to not interfere with JSON standard double quotes.     

**Update Customer Message**
<br/>_PUT /api/{v1}/customer/messages/{id}_

**Delete Customer Message**
<br/>_DELETE /api/{v1}/customer/messages/{id}_

##KALPA

**TODO: Get and Update KALPA Resources**
<br/>_GET /api/{v1}/kalpa/{KALPA-API-URL}_
- 401 is Customer Token not found

##Geo-Location 

**TODO: Store Device Location**
<br/>_GET /api/{v1}/device_
- Successful interaction results in a 204 response  



How Basic Auth works https://developer.mozilla.org/en-US/docs/Web/HTTP/Basic_access_authentication

##Version Log

**0.5**
Intro of user profiles. Only they can log in.

**0.4**
New user inbox now initialized with more messages

**0.3**
Added User Accounts endpoints

**0.2**
Changed message IDs to be 32-bit

**0.1**
Initial push to AWS with messages endpoints
  