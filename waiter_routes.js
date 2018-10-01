module.exports = function(factory){

    async function registrations(req, res) {
        let location = req.body.townsBtn;
        console.log(location);
        if(!location){
            req.flash('location', 'Please select a location')
        }
        let regNumber = req.body.regNumberInput;
        if(regNumber === ''){
            req.flash('regNum', 'Please enter a registration to be added')
        }
        // await factory.storeInDB(regNumber, location);

       res.render('home', {
         confirm: await factory.storeInDB(regNumber, location),  
         registration: await factory.returnRegNumbers(),
         town: await factory.returnTowns()
         
       });
     }

    async function filtered(req, res) {
        res.render('home', {
           registration: await factory.returnFilter(req.params.town_name),
           town: await factory.returnTowns()
        });
     }

    async function clear(req, res) {
        await factory.resetReg();
        await factory.resetTowns();
       res.redirect('/');
     } 
     
    return {
        registrations,
        filtered,
        clear
    }
};
