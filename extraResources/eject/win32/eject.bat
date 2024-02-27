@if (@X)==(@Y) @end /* JScript comment
        @echo off
        cscript //E:JScript //nologo "%~f0" %*
		::pause
        exit /b %errorlevel%
@if (@X)==(@Y) @end JScript comment */

if (WScript.Arguments.Length < 1 ) {
	WScript.Quit(0);
}

var toEject = WScript.Arguments.Item(0).toUpperCase();

if(toEject.indexOf(":") !== -1) {
    toEject = toEject.substring(0, toEject.indexOf(":"));
}

var ShellObj = new ActiveXObject("Shell.Application");
var drives = ShellObj.NameSpace(17);
var drivesItems = drives.Items();

var usbTypeEN = "USB Drive";
var usbTypeFR = "Lecteur USB";


function callVerbFromBottom(item){
    var itemVerbs=item.Verbs();
    var verb=itemVerbs.Item(itemVerbs.Count-6);
    while (item.Type === usbTypeEN || item.Type === usbTypeFR) {
        verb.DoIt();
        item.InvokeVerb(verb.Name.replace("&",""));
	}
}

function ejectByLetter(letter) {
		var driveFound=false;
		for (var i = 0; i < drivesItems.Count; i++){
			var item = drivesItems.Item(i);

			if(
				item.Name.indexOf(":") !== -1 &&
				item.Name.indexOf("(") !== -1 &&
				item.Name.indexOf(")") !== -1
			) {
				var itemDriveLetter = item.Name.substring(item.Name.indexOf("(") + 1, item.Name.indexOf(":"));
                WScript.Echo(item.Name);
                WScript.Echo(letter);
                WScript.Echo(itemDriveLetter);
				if(itemDriveLetter.toUpperCase() === letter) {
					if(item.Type === usbTypeEN || item.Type === usbTypeFR) {
						callVerbFromBottom(item);
					} else {
						WScript.Echo("Drive " + letter + " (" + item.Type + ") does not support ejectuation");
						WScript.Quit(2);
					}
					driveFound=true;
					break;
				}
			}
		}

		if(!driveFound){
			WScript.Echo("Drive " + letter +" has not been found");
			WScript.Quit(3);
		}
}

ejectByLetter(toEject);
