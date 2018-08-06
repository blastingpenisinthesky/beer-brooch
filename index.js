/**
 * Version: 0.1.5 19705
 * Configured by Blasting Penis In The Sky
 */

const LAIN_ID = 80081,                          // Lein's Dark Root Beer ID
	MARROW_ID = 51028,							// Marrow Brooch ID
	QUATREFOIL_ID = 51011,						// Quatrefoil Brooch ID
	QUICKCARVE_ID = 98405,						// Quickcarve Brooch ID
    LAIN_DELAY = 5000,                         // How much time in miliseconds should wait after buff (seconds * 1000)
	MARROW_DELAY = 4000,
	QUATREFOIL_DELAY = 4000,
	QUICKCARVE_DELAY = 4000;
	
/**
 * DON'T CHANGE ANYTHING BELOW THIS LINE
 */

const skills = require('./skills'),
    Command = require('command');

module.exports = function LetMeDrink(dispatch) {
    const command = Command(dispatch);

    let enabled = true,
        oCid = null,
        oJob = null,
        oX = null,
        oY = null,
        oZ = null,
        oW = null,
        qtdDrink = 0,
        idDrink = null,
		idMarrow = null,
		idquatrefoil = null,
		idquickcarve = null,
        isCdDrink = false,
        getInfoCommand = false;

    command.add('letmedrink', () => {
        enabled = !enabled;
        let txt = (enabled) ? 'ENABLED' : 'DISABLED';
        message('Let me Drink is ' + txt, true);
    });

    command.add('getskillinfo', () => {
        getInfoCommand = true;
        message('Use the desired skill and check proxy console.', true);
    });

    dispatch.hook('S_LOGIN', 10, (event) => {
        oCid = event.gameId;
        oJob = (event.templateId - 10101) % 100;
    });

    dispatch.hook('C_PLAYER_LOCATION', 5, { order: -10 }, (event) => {
        oX = (event.loc.x + event.dest.x) / 2;
        oY = (event.loc.y + event.dest.y) / 2;
        oZ = (event.loc.z + event.dest.z) / 2;
        oW = event.w;
    });

    dispatch.hook('S_INVEN', 14, { order: -10 }, (event) => {
        if (!enabled) return;

        let tempInv = event.items;
        for (i = 0; i < tempInv.length; i++) {
            if (tempInv[i].id == LAIN_ID) {
                qtdDrink = tempInv[i].amount;
                idDrink = tempInv[i].dbid;
			}
			if (tempInv[i].id == MARROW_ID) {
                idMarrow= tempInv[i].dbid;
			}
			if (tempInv[i].id == QUATREFOIL_ID) {
                idquatrefoil= tempInv[i].dbid;
			}
			if (tempInv[i].id == QUICKCARVE_ID) {
                idquickcarve= tempInv[i].dbid;
            
			}
        }
    });

    dispatch.hook('S_START_COOLTIME_ITEM', 1, event => {
        if (event.item == LAIN_ID && isCdDrink == false) {
            isCdDrink = true;
            setTimeout(function () { isCdDrink = false; }, event.cooldown * 1000);
        }
    });

    dispatch.hook('C_START_SKILL', 5, { order: -10 }, (event) => {
        if (!enabled) return;

        let sInfo = getSkillInfo(event.skill);

        if (getInfoCommand) {
            message('Skill info: (group: ' + sInfo.group + ' / job: ' + oJob + ')');
            getInfoCommand = false;
        }

         for (s = 0; s < skills.length; s++) {
            if (skills[s].group == sInfo.group && skills[s].job == oJob && isCdDrink == false && qtdDrink > 0) {
                beer();
                marrow();
                break;
            }
        }
    });

function beer() {
        setTimeout(function () {
            dispatch.toServer('C_USE_ITEM', 3, {
                gameId: oCid,
                id: LAIN_ID,
                dbid: idDrink,
                target: 0,
                amount: 1,
                dest: {x: 0, y: 0, z: 0},
                loc: {x: oX, y: oY, z: oZ},
                w: oW,
                unk1: 0,
                unk2: 0,
                unk3: 0,
                unk4: 1
            });
            isCdDrink = true;
            qtdDrink--;
            setTimeout(function () { isCdDrink = false; }, 60000);
        }, LAIN_DELAY);
    }
    
    function marrow() {
        setTimeout(function () {
            dispatch.toServer('C_USE_ITEM', 3, {
                gameId: oCid,
                id: MARROW_ID,
                dbid: idMarrow,
                target: 0,
                amount: 1,
                dest: {x: 0, y: 0, z: 0},
                loc: {x: oX, y: oY, z: oZ},
                w: oW,
                unk1: 0,
                unk2: 0,
                unk3: 0,
                unk4: 1
            });
        }, MARROW_DELAY);
    }

	    function quickcarve() {
        setTimeout(function () {
            dispatch.toServer('C_USE_ITEM', 3, {
                gameId: oCid,
                id: QUICKCARVE_ID,
                dbid: idquickcarve,
                target: 0,
                amount: 1,
                dest: {x: 0, y: 0, z: 0},
                loc: {x: oX, y: oY, z: oZ},
                w: oW,
                unk1: 0,
                unk2: 0,
                unk3: 0,
                unk4: 1
            });
        }, QUICKCARVE_DELAY);
    }
	
	    function quatrefoil() {
        setTimeout(function () {
            dispatch.toServer('C_USE_ITEM', 3, {
                gameId: oCid,
                id: QUATREFOIL_ID,
                dbid: idquatrefoil,
                target: 0,
                amount: 1,
                dest: {x: 0, y: 0, z: 0},
                loc: {x: oX, y: oY, z: oZ},
                w: oW,
                unk1: 0,
                unk2: 0,
                unk3: 0,
                unk4: 1
            });
        }, QUATREFOIL_DELAY);
    }
	
    function getSkillInfo(id) {
        let nid = id -= 0x4000000;
        return {
            id: nid,
            group: Math.floor(nid / 10000),
            level: Math.floor(nid / 100) % 100,
            sub: nid % 100
        };
    }

    function message(msg, chat = false) {
        if (chat == true) {
            command.message('(Let Me Drink) ' + msg);
        } else {
            console.log('(Let Me Drink) ' + msg);
        }
    }
}