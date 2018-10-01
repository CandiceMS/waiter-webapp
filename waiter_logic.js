module.exports = function(pool) {
        
        async function storeInDB(regInput, locationInput) {

          if (regInput == "" || !locationInput) {
            return ;
          }

          let reg = regInput.toLowerCase();
          let townCode = '';

          if(locationInput === "cape town") {
            townCode = "ca";
          }
          if(locationInput === "paarl") {
            townCode = "cj";
          }
          if(locationInput === "bellville") {
            townCode = "cy";
          }
          if(locationInput === "stellenbosch") {
            townCode = "cl";
          }

          let rowResult = await pool.query('select * from towns where town_name = $1', [locationInput])
          let rowResult2 = await pool.query('select * from reg_numbers where reg_number = $1', [reg])

          if(rowResult.rowCount === 0){
            await pool.query('insert into towns(town_name, town_code) values($1, $2)', [locationInput, townCode])
          }
             
          let townColumn = await pool.query('select id from towns where town_name = $1', [locationInput])
          let townId = townColumn.rows[0].id;

          // let townCodeCol = await pool.query('select town_code from towns where town_name = $1', [locationInput])

          if(rowResult2.rowCount === 0){
           if(reg.startsWith(townCode)){
             await pool.query('insert into reg_numbers(reg_number, town_id) values($1, $2)', [reg, townId])
              return "You added a registration number for this town!"
            }
           else {
              return "Sorry. This is not a valid registration number for this town"
            }
          }
        }

        async function returnRegNumbers() {
          let returnRows = await pool.query('select * from reg_numbers')
            return returnRows.rows;
        }

        async function returnTowns() {
            let returnRows = await pool.query('select * from towns')
              return returnRows.rows;
          }

        async function returnFilter(locationInput) {
          let townColumn = await pool.query('select id from towns where town_name = $1', [locationInput])
             let townId = townColumn.rows[0].id;
          let filterReg = await pool.query('select reg_number from reg_numbers where reg_numbers.town_id = $1', [townId])
            return filterReg.rows;
        }

        async function resetReg() {
          let resetRegNumbers = await pool.query('delete from reg_numbers');
          return resetRegNumbers.rows;
        }
        async function resetTowns(){
            let reset = await pool.query('delete from towns');
            return reset.rows;
        }
      
      return {
          storeInDB,
          returnRegNumbers,
          returnTowns,
          returnFilter,
          resetReg,
          resetTowns
        }
      }
      
      
      
  
    
  
  
