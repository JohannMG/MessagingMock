function UserProfiles() {
    this.profiles = getStandardUserProfiles();
}

function getStandardUserProfiles(){
    return [
        {
            username: "kodak@aaa.com",
            password: "kodak12345",
            token: "4czmnnvn-63v1-vxiv-6hmt-uf1x74u1smed",            
        },{
            username: "fuji@aaa.com",
            password: "fuji12345",
            token: "383l6342-8ncu-l7j6-pl2u-577bb3hc2d4p",            
        },{
            username: "IMAX@aaa.com",
            password: "IMAX12345",
            token: "fvm64a1o-18w2-0ynb-zv33-ge1lf17ldbw9",            
        },{
            username: "Arri@aaa.com",
            password: "Arri12345",
            token: "iz7rajw5-kvbc-gi43-sgf7-unf78cvrao1i",            
        }, {
            username: "cooke@aaa.com",
            password: "cooke12345",
            token: "xri9tpyl-fn3f-452o-tt4c-2bw5i6fpzrjs"
        }
    ];
}

UserProfiles.prototype.authenticatesWithUserPass = function authenticatesWithUserPass(username, password) {
    username = username.trim().toUpperCase();
    password = password.trim().toUpperCase();
    
    return this.profiles.reduce( function (previousVal, currVal, index, arr) {
        return previousVal ||  ( username === currVal.username.toUpperCase()  && password === currVal.password.toUpperCase() );
          
    },false);    
   } ;

UserProfiles.prototype.getTokenForUsername = function getTokenForUsername(username) {
    
    username = username.trim().toUpperCase();
    
    var userFound = this.profiles.find(function (element) {
        return username === element.username.toUpperCase(); 
    });
    
    if (userFound === undefined){
        return null;
    } 
    
    return userFound.token;
    
};


module.exports = UserProfiles;

/**
Kodak
Fuji
Imax
Arri
Cooke
Holga
Nikon
 */