 module.exports = function(pool) {

  async function storeInDB(nameInput, daysInput) {

    if (nameInput == "") {
      return ;
    }

    let name = nameInput.toLowerCase();
    let nameRow = await pool.query('select * from waiter_shifts where waiter_name = $1', [name])
      if (nameRow.rowCount === 0){
        await pool.query('insert into waiter_shifts(waiter_name) values $1', [name])
      }

      if(mondayBtn) {
        await pool.query('update waiter_shifts set monday = $1 where waiter_name = $2', [true, name])
      }
      if(tuesdayBtn) {
        await pool.query('update waiter_shifts set tuesday = $1 where waiter_name = $2', [true, name])
      }
      if(wednesdayBtn) {
        await pool.query('update waiter_shifts set wednesday = $1 where waiter_name = $2', [true, name])
      }
      if(thursdayBtn) {
        await pool.query('update waiter_shifts set thursday = $1 where waiter_name = $2', [true, name])
      }
      if(fridayBtn) {
        await pool.query('update waiter_shifts set friday = $1 where waiter_name = $2', [true, name])
      }
      if(saturdayBtn) {
        await pool.query('update waiter_shifts set saturday = $1 where waiter_name = $2', [true, name])
      }
      if(sundayBtn) {
        await pool.query('update waiter_shifts set sunday = $1 where waiter_name = $2', [true, name])
      }

      return "Thank you " + nameInput + ", your shifts have been saved"
   }

  async function returnAllWaiters() {
    let returnWaiters = await pool.query('select * from waiter_shifts')
      return returnWaiters.rows;
  }

  async function returnAllDays() {
    let returnDays = await pool.query('select * from waiter_shifts where true')
    return returnDays.rows;
  }

  async function returnDay(shift) {
    let returnShift = await pool.query('select * from waiter_shifts where $1 = true', [shift])
    return returnShift.rows;
  }

  async function returnWaiterShifts(name) {
    let waiterRow = await pool.query('select * from waiter_shifts where waiter_name = $1 and $2 = true',[name, daysInput])
    return waiterRow.rows[0];    
  }
  
  async function resetTable(){
      let reset = await pool.query('delete from waiter_shifts');
      return reset.rows;
  }

return {
    storeInDB,
    returnAllWaiters,
    returnAllDays,
    returnDay,
    returnWaiterShifts,
    resetTable
  }
}

    // let idColumn = await pool.query('select id from waiters where waiter_name = $1', [name])
    // let waiterId = idColumn.rows[0].id;
    //   await pool.query('insert into waiter_shifts(waiter_id) values $1', [waiterId])
  

      
      
      
  
    
  
  
