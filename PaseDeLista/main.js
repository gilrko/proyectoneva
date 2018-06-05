const {app,BrowserWindow} = require('electron');
const path = require('path'); //Muestra la ruta del archivo
const url = require('url'); //Carga una página
//Para PDF
const electron = require('electron');
//Sistema de archivos
const fs = require('fs');
//Acceso al SO
const os = require('os');
//Para declarar una función remota
const ipc = electron.ipcMain;
//Acceso a la terminal-línea de comandos
const shell = electron.shell;

let PantallaPrincipal;
//Objeto global para compartir datos entre pantallas 
global.datos = {
	usuario: '',
	clave: '',
	usuariovalida: '',
	periodoactual: ''
}

function muestraPantallaPrincipal(){
	PantallaPrincipal = new BrowserWindow({width:400,height:425});
	PantallaPrincipal.loadURL(url.format({
		pathname: path.join(__dirname,'index.html'),
		protocol: 'file',
		slashes: true
	}))
	PantallaPrincipal.show();
}

//Evento para PDF (declaración) 
ipc.on('print-to-pdf',function(event){
	const pdfPath=path.join(os.tmpdir(),'print.pdf')
	const win=BrowserWindow.fromWebContents(event.sender)
	win.webContents.printToPDF({},function(error,data){
		if(error) throw error
		fs.writeFile(pdfPath,data,function(error){
			if(error){
				throw error
			}
			shell.openExternal('file://'+pdfPath)
			win.close()
		})
	})
});

app.on('ready',muestraPantallaPrincipal)


