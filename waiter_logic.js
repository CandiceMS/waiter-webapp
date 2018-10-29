 module.exports = function(pool) {

  async function storeInDB(nameInput, daysInput) {

    if (nameInput == "" || daysInput == undefined) {
      return;
    }

    if (daysInput && (typeof daysInput === 'string')) {
      daysInput = [daysInput];
    }

    let name = nameInput.toLowerCase();

    let nameRow = await pool.query('select * from waiters where waiter_name = $1', [name])
      if (nameRow.rowCount === 0){
        await pool.query('insert into waiters(waiter_name) values($1)', [name])
      }  

    if(daysInput.length > 0) {
      for (let i = 0; i < daysInput.length; i++) {
        let day = daysInput[i];

        let selectShift = await pool.query('select shift from shifts where shift = $1', [day])
        let shiftId = selectShift.rows[0].id;

        let waiter_Id = await pool.query('select id from waiters where waiter_name = $1', [name]);
        let waiterId = waiter_Id.rows[0].id;

        await pool.query('insert into waiter_shifts(waiter_id, shift_id) values($1, $2)', [waiterId, shiftId])
      }
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

   async function getWaiterShifts(shiftDays){
    
    let days = shiftDays.map(day => { return day.shift})
// line above maps shifts to return an array of values. in this function, day is a placeholder for shiftDays.

     for (let i = 0; i < days.length; i++) {
       let day = days[i];
        let findDay = await pool.query('select * from shifts where shift = $1', [day])
        let dayId = findDay.rows[0].id;
        let findShift = await pool.query('select * from waiter_shifts where shift_id = $1', [dayId])
        for (let i = 0; i < findShift.length; i++) {
          let element = findShift[i];
          let waiter = await pool.query('select waiter_name from waiters where id = $1', [element])
          return waiter[0].rows
        }
      }
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
    storeInDB,
    allShifts,
    getWaiterShifts,
    resetWaiterShifts,
    resetShifts,
    resetWaiters
  }
}
  


      
      
      
  
    
  
  
