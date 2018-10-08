module.exports = function(factory){

    async function submitShifts(req, res) {
        let name = req.body.nameInput;
        let shifts = req.body.daysInput;

        console.log(name);
        console.log(shifts);
        let view1 = await factory.returnAllWaiters();
        console.log("v1 "+view1);
        let view2 = await factory.returnAllDays();
        console.log("v2 "+view2);
        let view3 = await factory.returnDay(shifts);
        console.log("v3 "+view3);
        let waiterShifts = await factory.returnWaiterShifts(name);
        console.log("v4 "+waiterShifts); 
       res.render('home', {
         confirm: await factory.storeInDB(name, shifts)  
        //  waiterShifts: await factory.returnWaiterShifts(name)         
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

// if(!daysInput){
        //     req.flash('daysAlert', 'Please your shifts')
        // }


// async function filtered(req, res) {
    //     res.render('home', {
    //        registration: await factory.returnFilter(req.params.town_name),
    //        town: await factory.returnTowns()
    //     });
    //  }
