module.exports = function(factory){

    async function submitShifts(req, res) {
        let name = req.body.nameInput;
        let shifts = req.body.daysInput;

        if(shifts == undefined){
            req.flash('alertShifts', 'You have not selected any shifts')
        }
       res.render('home', {
         confirm: await factory.storeInDB(name, shifts)           
       });
     }

     async function returnWaiterShifts(req, res) {
         res.render('shifts', {
             shifts: await factory.allShifts(),
             waiter_shifts: await factory.getWaiterShifts(shifts)
         });
     }

    async function clear(req, res) {
        await factory.resetWaiterShifts();
        await factory.resetShifts();
        await factory.resetWaiters();
       res.redirect('/');
     } 
     
    return {
        submitShifts,
        returnWaiterShifts,
        clear
    }
};

