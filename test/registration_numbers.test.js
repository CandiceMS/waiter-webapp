const assert = require("assert");
let RegNumbers = require("../registration_numbers");

let postgres = require('pg');
const Pool = postgres.Pool


let useSSL = false;
if(process.env.DATABASE_URL){
  useSSL = true;
}

const connectionString = process.env.DATABASE_URL || 'postgresql://coder:pg123@localhost:5432/registration_numbersDB'

const pool = new Pool({
  connectionString,
  ssl:useSSL
})

describe('Add and filter registration numbers for a location', function(){ 

    beforeEach(async function() {
        await pool.query("delete from reg_numbers");
        await pool.query("delete from towns");
      });   

    const factoryRegNumbers = RegNumbers(pool);

    it('should add the registration number for Cape Town', async function(){
      let regAdd = await factoryRegNumbers.storeInDB('CA 687-900','cape town');
        assert.equal(regAdd, "You added a registration number for this town!");
    });
    it('should add the registration number for Paarl', async function(){
        let regAdd = await factoryRegNumbers.storeInDB('CJ 687-900','paarl');
          assert.equal(regAdd, "You added a registration number for this town!");
    });
    it('should add the registration number for Bellville', async function(){
        let regAdd = await factoryRegNumbers.storeInDB('CY 687-900','bellville');
          assert.equal(regAdd, "You added a registration number for this town!");
    });
    it('should add the registration number for Stellenbosch', async function(){
        let regAdd = await factoryRegNumbers.storeInDB('CL 687-900','stellenbosch');
          assert.equal(regAdd, "You added a registration number for this town!");
    });

    it('should NOT add the registration number as it does not start with the required value for Cape Town', async function(){
        let regAdd = await factoryRegNumbers.storeInDB('CZ 687-900','cape town');
          assert.equal(regAdd, "Sorry. This is not a valid registration number for this town");
    });
    it('should NOT add the registration number as it does not start with the required value for Stellenbosch', async function(){
        let regAdd = await factoryRegNumbers.storeInDB('CZ 687-900','stellenbosch');
          assert.equal(regAdd, "Sorry. This is not a valid registration number for this town");
    });
   
    it('should NOT add a regsitration number as the requirements are incomplete', async function(){
        await factoryRegNumbers.storeInDB('', 'cape town');
        await factoryRegNumbers.storeInDB('', false);
        await factoryRegNumbers.storeInDB('CA 789-061', false);
       assert.deepEqual([], await factoryRegNumbers.returnRegNumbers());
    });
    
    it('should return only registration numbers for the selected town', async function(){
         await factoryRegNumbers.storeInDB('CA 670-901','cape town');
         await factoryRegNumbers.storeInDB('CA 687-901','cape town');
         await factoryRegNumbers.storeInDB('CA 680-000','cape town');
         await factoryRegNumbers.storeInDB('CY 679-130','bellville');

        assert.deepEqual([{'reg_number': 'ca 670-901'}, {'reg_number': 'ca 687-901'}, {'reg_number': 'ca 680-000'}], await factoryRegNumbers.returnFilter('cape town'));
    });
     it('should clear all values in the reg_numbers table in the database', async function(){
         await factoryRegNumbers.storeInDB('CL 687-978','stellenbosch');
         await factoryRegNumbers.storeInDB('CA 687-945','cape town');
         await factoryRegNumbers.storeInDB('CA 680-363','cape town');
         await factoryRegNumbers.storeInDB('CY 679-589','bellville');
        assert.deepEqual([], await factoryRegNumbers.resetReg());
     });
     it('should clear all values in the towns table in the database', async function(){
        await factoryRegNumbers.storeInDB('CL 687-924','stellenbosch');
        await factoryRegNumbers.storeInDB('CA 687-879','cape town');
        await factoryRegNumbers.storeInDB('CA 680-112','cape town');
        await factoryRegNumbers.storeInDB('CY 679-252','bellville');
       assert.deepEqual([], await factoryRegNumbers.resetReg(), await factoryRegNumbers.resetTowns());
    });

    after(async function() {
        await pool.end();
      });

   });
