module.exports = function (app) {
    // var local_host = require('./local_host.route.js');
    // app.post('/local_host/findconsent', local_host.findconsent);
    // app.post('/local_host/saveconsent', local_host.saveconsent);
    app.get('/org-config', function (req, res) {
        if (!process.env.ORG) {
            return res.status(500).json({ error: 'no organistion config' })
        }

        return res.status(200).json({ org: process.env.ORG })
    })

    var security = require('./utils/security');
    app.get('/security/login/:username/:shake128/:md5?', security.login);

    var centrix_q = require('./centrix_q.route.js');
    app.post('/centrix_q/q_regist', centrix_q.q_regist);
    app.post('/centrix_q/finddepartments', centrix_q.finddepartments);
    app.post('/centrix_q/findopd_byHN', centrix_q.findopd_byHN);
    app.post('/centrix_q/findcaseor', centrix_q.findcaseor);
    app.post('/centrix_q/q_ertriage', centrix_q.q_ertriage);

    var local_host = require('./local_host.js');
    app.post('/local_host/savedep', local_host.savedep);
    app.post('/local_host/finddepartment', local_host.finddepartment);
    app.post('/local_host/delete_room', local_host.delete_room);
    app.post('/local_host/delete_department', local_host.delete_department);
    app.post('/local_host/savetransaction', local_host.savetransaction);
    app.post('/local_host/findtransaction', local_host.findtransaction);
    app.post('/local_host/q_bydepartment', local_host.q_bydepartment);
    app.post('/local_host/savestatus', local_host.savestatus);
    app.post('/local_host/transaction_consult', local_host.transaction_consult);
    app.post('/local_host/transaction_finalstage', local_host.transaction_finalstage);
    app.post('/local_host/transaction_end', local_host.transaction_end);
    app.post('/local_host/saveroom', local_host.saveroom);
    app.post('/local_host/findroom', local_host.findroom);
    app.post('/local_host/findroom_bydep', local_host.findroom_bydep);
    app.post('/local_host/update_room', local_host.update_room);
    app.post('/local_host/findtransactionER', local_host.findtransactionER);
    app.post('/local_host/savetransactionER', local_host.savetransactionER);
    app.post('/local_host/findcase_by4digit', local_host.findcase_by4digit);
    app.post('/local_host/savestatusER', local_host.savestatusER);
}
