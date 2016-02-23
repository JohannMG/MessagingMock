# MessagingMock

Mocks the API endpoints at `/api/v1/customer/messages/`

Use `GET /api/v1/customer/messages/?offset=10&limit=100` before any other method for the test API to generate a 'mailbox' for the user. 

Afterwards all API endpoints are to spec. 

Spec does not yet show how HTML will formatted in JSON, so currently sends minified HTML that uses single quotes to not interfere with JSON standard double quotes.  