import { Base, ResponseError } from '@base'
import Sysadmin from '@plans/sysadmin/sysadmin.js'
import Migration from "@classes/migration/migration.js"

export default class Migrations extends Sysadmin {

  constructor(){
    super();
    this.migrations = new Migration();
  }

  async test(){
    this.response.reply("works");
    return true;
  }

  async migrateStripe(){

  	var customer = "";

  	await this.migrations.ensureAllAccountsAreStripeCustomers(this.database.mongo.db);

  	this.response.reply("customer");
  	return true;
  }

}