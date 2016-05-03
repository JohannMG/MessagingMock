var express = require('express');
var router = express.Router();

var loggedInCheck = require('../Modules/AuthChecker.js'); 


router.get('/', loggedInCheck, function getCustomer(req, res, next) {
    
    res.set('AAA-Profile-Completion', 100);
        
    //Mock data provided by API docs
    res.status(200).json({
        ProxyUI: "0123456789",
        FirstName: "Brett",
        MiddleName: "G",
        LastName: "Smith",
        NamePrefix: "Mr",
        NameSuffix: null,
        StreetAddress: "12345 SESAME ST",
        AptUnitNumber: null,
        City: "ST. PETERSBURG",
        State: "FL",
        ZipCode: "33716",
        Email: "brett.smith@someotherdomain.com",
        HomePhone: "727-123-4567",
        WorkPhone: "727-234-5678",
        CellPhone: "727-345-6789",
        BirthDate: "1975-08-25",
        Gender: "M",
        MaritalStatus: "M",
        
        "Membership": {
            Number: "4290472336538006",
            Type: "Premier",
            YearJoined: 2003,
            Expiration: "2016-12-31"
        }
        
    });
    
});

 
 //sending routing mini-'app' back
 module.exports = router;