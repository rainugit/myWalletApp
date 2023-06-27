export class TransactionModel {
    
    constructor(personid, transtype,transamt,balance,activity,transcreateddt) {
        this.personid  = personid;
        this.transtype = transtype;
        this.transamt  = transamt;
        this.balance   = balance;
        this.activity  = activity;
        this.transcreateddt = transcreateddt;
      }
    
}

export class PersonModel {

    constructor(username,pwdhash,userauthsecret,userauthqrlink,walletbalance,updateddt,emailid,userid){
        this.username       = username;
        this.pwdhash        = pwdhash;
        this.userauthsecret = userauthsecret;
        this.userauthqrlink = userauthqrlink;
        this.walletbalance  = walletbalance;
        this.updateddt      = updateddt;
        this.emailid        = emailid;
        this.userid         = userid;
    }
}

export class ResponseModel {

    constructor(status,message,walletbalance){
        this.status  = status;
        this.message = message;
        this.walletbalance = walletbalance;
    }
}
