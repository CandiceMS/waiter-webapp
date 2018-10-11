module.exports = function(factory){

    async function submitShifts(req, res) {
        let name = req.body.nameInput;
         let shifts = req.body.daysInput;
         console.log(shifts);

       
       res.render('home', {
         confirm: await factory.storeInDB(name, shifts)           
       });
     }

    async function clear(req, res) {
        await factory.resetTable();
       res.redirect('/');
     } 
     
    return {
        submitShifts,
        clear
    }
};

