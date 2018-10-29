const assert = require("assert");
let waiterLogic = require("../waiter_logic");

let postgres = require('pg');
const Pool = postgres.Pool


let useSSL = false;
if(process.env.DATABASE_URL){
  useSSL = true;
}

const connectionString = process.env.DATABASE_URL || 'postgresql://coder:pg123@localhost:5432/waiter_app'

const pool = new Pool({
  connectionString,
  ssl:useSSL
})

describe('Add and display waiters, shifts and their relation', function(){ 

    beforeEach(async function() {
        await pool.query("delete from waiter_shifts");
        //  await pool.query("delete from shifts");
        await pool.query("delete from waiters")
      });   

    const factoryLogic = waiterLogic(pool);

    it('should add the waiter name and all shifts selected', async function(){
      let waiterAdd = await factoryLogic.storeInDB('Alice','monday');
        assert.equal(waiterAdd, " Thank you Alice. Your shifts have been saved");
    });
    it('should add the waiter name and all shifts selected', async function(){
        let shiftsAdd = await factoryLogic.storeInDB('Jack',['monday', 'tuesday', 'thursday']);
          assert.deepEqual(shiftsAdd, " Thank you Jack. Your shifts have been saved");
    });
    it('should not add the shifts selected because no waiter name has been entered', async function(){
        let noAdd = await factoryLogic.storeInDB('', ['friday', 'saturday']);
          assert.deepEqual(noAdd, undefined);
    });
    it('should not add the waiter name because no shifts have been selected ', async function(){
        let noAdd = await factoryLogic.storeInDB('Bob', false);
          assert.equal(noAdd, 'Please make a selection from the available shifts');
    });


    it('should return all days', async function(){
      let shiftDays = await factoryLogic.allShifts();
      assert.deepEqual([{shift: 'monday'}, {shift: 'tuesday'}, {shift: 'wednesday'}, {shift: 'thursday'}, {shift: 'friday'}, {shift: 'saturday'}, {shift:'sunday'}], shiftDays);
    });


    it('should NOT add relevant values to the database as the requirements are incomplete', async function(){
        await factoryLogic.storeInDB('', 'sunday');
        await factoryLogic.storeInDB('', false);
        await factoryLogic.storeInDB('Bob', false);
        let shiftsEntered = await factoryLogic.allShifts();
        let waiterShifts = await factoryLogic.getWaiterShifts(shiftsEntered);
        console.log(waiterShifts);
       assert.deepEqual(undefined, waiterShifts);

    });

    after(async function() {
        await pool.end();
      });

   });

       // it('should return only registration numbers for the selected town', async function(){
    //      await factoryLogic.storeInDB('Greg',['tuesday', 'saturday', 'sunday']);
    //      await factoryLogic.storeInDB('Candice',['tuesday', 'saturday', 'sunday']);
    //      await factoryLogic.storeInDB('Andrew',['monday', 'wednesday', 'friday']);
    //      await factoryLogic.storeInDB('Nathri',['monday', 'wednesday', 'friday']);
    //      await factoryLogic.storeInDB('Yegan',['tuesday', 'wednesday', 'saturday']);

    //     assert.deepEqual([{'reg_number': 'ca 670-901'}, {'reg_number': 'ca 687-901'}, {'reg_number': 'ca 680-000'}], await factoryRegNumbers.returnFilter('cape town'));
    // });
    //  it('should clear all values in the reg_numbers table in the database', async function(){
    //      await factoryLogic.storeInDB('CL 687-978','stellenbosch');
    //      await factoryLogic.storeInDB('CA 687-945','cape town');
    //      await factoryLogic.storeInDB('CA 680-363','cape town');
    //      await factoryLogic.storeInDB('CY 679-589','bellville');
    //     assert.deepEqual([], await factoryLogic.resetReg());
    //  });
    //  it('should clear all values in the towns table in the database', async function(){
    //     await factoryLogic.storeInDB('CL 687-924','stellenbosch');
    //     await factoryLogic.storeInDB('CA 687-879','cape town');
    //     await factoryLogic.storeInDB('CA 680-112','cape town');
    //     await factoryLogic.storeInDB('CY 679-252','bellville');
    //    assert.deepEqual([], await factoryLogic.resetReg(), await factoryLogic.resetTowns());
    // });
