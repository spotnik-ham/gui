module.exports = function wifi() {


// f4gbv wifi tests: 070318:
//wwwwwwwwwwwwwwwwwwwwwwwwww 

//manager:
var cli = process.env.NM_CLI || 'nmcli'
var cli = 'nmcli'

var regex = /(.*)\.(.*)/g; 

var getDeviceCmd = cli + ' -t  -f type,device,state,connection d';
var getAvailableWifiNetworkCmd = cli + ' -t -f ssid,mode,signal,security  d  wifi';
var getConnection1 = cli + ' -t -f uuid,type c';

const path = require('path')
const childProcess = require('child_process')
const wifi = require('./wifi')
const exec = promisify(childProcess.exec)
//wwwwwwwwwwwwwwwwwwwwwwwwww


//f4gbv wifi tests 070318:
//wwwwwwwwwwwwwwwwwwwwwww

//common :

function runCommand(cli1){
    var pOut  = null;
       
    pOut = exec(path.join(config.dir,cli1));
    return pOut;
 }


//manager(suite)

function getWifiNetworkAvailable(){
        var networks = [];
//gbv 080318: 
	var buf = runCommand(getAvailableWifiNetworkCmd);
//	var buf = runCommand(getConnection1);
	
        var str = buf.toString();
        var arr = str.split(/\r?\n/);
        for (var i = 0; i<arr.length; i++){

//gbv 080318:
		var buf = runCommand(getAvailableWifiNetworkCmd);
//		var buf = runCommand(getConnection1);
		var obj = {
                	toString : function (){
                   	return JSON.stringify(this);
                }
            };
            var row = arr[i];
            var values = row.split(':');
            var ssid = values[0];
	    if (!ssid )
                continue;
            obj.ssid = ssid;
            obj.mode = values[1];
            obj.signal = values[2];
            obj.security = values[3];
            networks.push(obj)
 //f4gbv 100318 :
 	    .then(wifi =>	JSON.parse(obj))
	;
        }
        return networks;
}


//manager(suite):

//getDevices : function
function getDevices(){
        var devices = [];
        var buf = runCommand(getDeviceCmd);
        var str = buf.toString();
        var arr = str.split(/\r?\n/);
        for (var i = 0; i<arr.length; i++){
            var obj = {
                toString : function (){
                   return JSON.stringify(this);
                }
            };
            var row = arr[i];
            var values = row.split(':');
            var type = values[0];
//            if (!type ||  (type != 'wifi' &&  type != 'ethernet'))
//                continue;
            obj.type = type;
            obj.device = values[1];
            obj.state = values[2];
            obj.connection = values[3];
            devices.push(obj);
        }
        return devices;
}

function getConnection (){
        var devices = [];
        var buf = runCommand(getConnection1);
        var str = buf.toString();
        var arr = str.split(/\r?\n/);
        for (var i = 0; i<arr.length; i++){
            var row = arr[i];
            var values = row.split(':');
            var type = values[1];
            if(type != '802-11-wireless' && type != '802-3-ethernet')
                continue;
            var buf = runCommand(cli + ' -t c show ' + values[0]);
            var objStr = buf.toString();

            var objArr = objStr.split(/\r?\n/);
             var obj = {
                    toString : function (){
                        return JSON.stringify(this);
                    }
            };
            for (var j = 0; j < objArr.length; j++){
               
                var objRowVal = objArr[j];
                var values = objRowVal.split(':');
                var keyStr = values[0];
                var objVal = values[1];
                var objKeyValues = keyStr.split('.');
                var rootkey = objKeyValues[0];
                objKeyValues = objKeyValues[1];
                var inx = objKeyValues ? objKeyValues.indexOf('['): -1;
                
                var index = null;
                if (objKeyValues && inx >=0)
                    index = objKeyValues.substring(inx+1, objKeyValues.length-1 ); 
                else
                inx = objKeyValues ? objKeyValues.length : null;

                var childKey = objKeyValues ? objKeyValues.substring(0, inx): null;
                if (rootkey && childKey){
                if (!obj[rootkey]){
                    obj[rootkey] = {}; 
                }
                if(index && !obj[rootkey][childKey]){
                   obj[rootkey][childKey] = []; 
                }

                if (index){
                    obj[rootkey][childKey].push(objVal);
                }else {
                    obj[rootkey][childKey] = objVal;
                }
                }
            }
            devices.push(obj);
        }
  return devices;
}

	
	
//wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww
//gbv080318:
		var out =getWifiNetworkAvailable();
//		console.log(out);
//		return out.type
//		var out = getDevices()
//		return getDevices()
//		return getConnection()
//		return JSON.stringify(out)
//getWifiNetworkAvailable()
//wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww


	return out



}

