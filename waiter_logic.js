 module.exports = function(pool) {

  async function createShifts() {
   let countShifts = await pool.query('select shift from shifts')
   let dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    if (countShifts.rowCount === 0) {
      for (let i = 0; i < dayNames.length; i++) {
        let shiftName = dayNames[i];
        await pool.query('insert into shifts(shift) values($1)', [shiftName])      
      }
    }   
  }

  async function storeInDB(nameInput, daysInput) {

    if (nameInput == "" || daysInput == undefined) {
      return;
    }

    if (daysInput && (typeof daysInput === 'string')) {
      daysInput = [daysInput];
    }

    createShifts();

    let name = nameInput.toLowerCase();

    let nameRow = await pool.query('select * from waiters where waiter_name = $1', [name])
      if (nameRow.rowCount === 0){
        await pool.query('insert into waiters(waiter_name) values($1)', [name])
      }  

    if(daysInput.length > 0) {
      for (let i = 0; i < daysInput.length; i++) {
        let day = daysInput[i];

        let selectShift = await pool.query('select id from shifts where shift = $1', [day])
        let shiftId = selectShift.rows[0].id;

        let waiter_Id = await pool.query('select id from waiters where waiter_name = $1', [name]);
        let waiterId = waiter_Id.rows[0].id;

        await pool.query('insert into waiter_shifts(waiter_id, shift_id) values($1, $2)', [waiterId, shiftId])
      }
      // ALTERNATIVE CODE TO SIMULTANEOUSLY INSERT VALUE AND RETURN IT'S ID:
      // let results = await pool.query(`insert into categories (description)  
      // values ($1)
      // returning id, description`, data);
      // return results.rows[0]
      return " Thank you " + nameInput + ". Your shifts have been saved"
    }
    else if(daysInput == '' || daysInput == false) {
      return "Please make a selection from the available shifts"
    } 
   }

   async function allShifts() {
     let days = await pool.query('select shift from shifts');
      return days.rows;
   }

   async function getWaiterShifts(shiftDay){
    //  console.log(shiftDay);
    
      // let days = shiftDay.map(day => { return day.shift})
// line above maps shifts to return an array of object values. In this function, day is a placeholder for shiftDay.

    //  for (let i = 0; i < days.length; i++) {
    //    let day = days[i];
    //      console.log(day);

    // if (shiftDay.isArray)


        let findDay = await pool.query('select * from shifts where shift = $1', [shiftDay])
        // console.log(findDay.rows);
        let dayId = findDay.rows[0].id;
          // console.log(dayId);
        let shiftRows = await pool.query('select * from waiter_shifts where shift_id = $1', [dayId]);
        // console.log(shiftRows.rows);
        let findShift = shiftRows.rows;
        let holdWaiters = [];
        for (let i = 0; i < findShift.length; i++) {
          let element = findShift[i];
           console.log(element);
           console.log(element.waiter_id);
          let waiter = await pool.query('select * from waiters where id = $1', [element.waiter_id])
          let returnWaiter = waiter.rows[0];
           holdWaiters.push(returnWaiter.waiter_name);
        }
        return holdWaiters;
      // }
   };

  async function resetWaiterShifts(){
      let reset = await pool.query('delete from waiter_shifts');
      return reset.rows;
  }
  async function resetShifts(){
    let reset = await pool.query('delete from shifts');
    return reset.rows;
}
async function resetWaiters(){
  let reset = await pool.query('delete from waiters');
  return reset.rows;
}

return {
    createShifts,
    storeInDB,
    allShifts,
    getWaiterShifts,
    resetWaiterShifts,
    resetShifts,
    resetWaiters
  }
}
  


      
      
      
  
    
  
  
