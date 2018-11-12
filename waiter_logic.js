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
    let holdWaiters = [];
    //if (typeof shiftDay === 'string') {
    //  shiftDay = [shiftDay];

       for (let i = 0; i < shiftDay.length; i++) {
       let day = shiftDay[i];
    
        let findDay = await pool.query('select * from shifts where shift = $1', [day.shift])
        let dayId = findDay.rows[0].id;
        let shiftRows = await pool.query('select * from waiter_shifts where shift_id = $1', [dayId]);
        let findShift = shiftRows.rows;
        
        let mapName = [];
        let map = {}

        for (let i = 0; i < findShift.length; i++) {
          let element = findShift[i];
          let waiter = await pool.query('select waiter_name from waiters where id = $1', [element.waiter_id])
          let returnWaiter = waiter.rows[0].waiter_name;
           mapName.push(returnWaiter);
        }
         if(map.day === undefined){
          map = {
            day : day.shift,
            waiter_name : mapName
          }
         }

        holdWaiters.push(map);
      }
      //  console.log(holdWaiters);
    //}
    return holdWaiters;
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

      // ALTERNATIVE CODE TO SIMULTANEOUSLY INSERT VALUE AND RETURN IT'S ID:
      // let results = await pool.query(`insert into categories (description)  
      // values ($1)
      // returning id, description`, data);
      // return results.rows[0]


    // let days = shiftDay.map(day => { return day.shift})
    // line above maps shifts to return an array of object values. In this function, day is a placeholder for shiftDay.
  
  // Query to join tables for rendering (inner join):
  // SELECT character.name, character_actor.actor_name
  // FROM character 
  // INNER JOIN character_actor
  // ON character.id = character_actor.character_id;


      
      
      
  
    
  
  
