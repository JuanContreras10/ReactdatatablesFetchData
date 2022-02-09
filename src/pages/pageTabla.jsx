//dependecias de react
import React,  { 
    useState,
     useEffect,
     useMemo
    }  from 'react';
//dependecias de material ui

import {
    Grid,
    Typography,
  //  InputLabel  ,
    CircularProgress,
    IconButton,
    Tooltip  ,
  //  MenuItem ,
   // Select,
    FormControl ,
    AppBar  ,
    Button ,
    Snackbar ,
    Modal ,
    Box ,
    TextField
      
} from '@mui/material/';
import MuiAlert from '@mui/material/Alert';
//dependecias extra
import DataTable from 'react-data-table-component';//datatable para react
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faFileCsv,
    faFilePdf ,
    faSearch,
    faTrash,

} from '@fortawesome/free-solid-svg-icons';
import DateTimePicker from 'react-datetime-picker';
import jsPDF from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";
import Slide from '@material-ui/core/Slide';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
function Transition(props) {
  return <Slide {...props} direction="left" />;
}


function convertArrayOfObjectsToCSVTablas(array) {
	let result;

	const columnDelimiter = ',';
	const lineDelimiter = '\n';
	const keys = Object.keys(dataTablas[0]);

	result = '';
	result += keys.join(columnDelimiter);
	result += lineDelimiter;

	array.forEach(item => {
		let ctr = 0;
		keys.forEach(key => {
			if (ctr > 0) result += columnDelimiter;

			result += item[key];
			// eslint-disable-next-line no-plusplus
			ctr++;
		});
		result += lineDelimiter;
	});

	return result;
}

function downloadCSVTablas(array,tabla) {
  
	const link = document.createElement('a');
	let csv = convertArrayOfObjectsToCSVTablas(array);
	if (csv == null) return;

	const filename = 'reporte'+tabla+'.csv';

	if (!csv.match(/^data:text\/csv/i)) {
		csv = `data:text/csv;charset=utf-8,${csv}`;
	}

	link.setAttribute('href', encodeURI(csv));
	link.setAttribute('download', filename);
	link.click();
}

function convertArrayOfObjectsToCSV(array) {
	let result;

	const columnDelimiter = ',';
	const lineDelimiter = '\n';
	const keys = Object.keys(data[0]);

	result = '';
	result += keys.join(columnDelimiter);
	result += lineDelimiter;

	array.forEach(item => {
		let ctr = 0;
		keys.forEach(key => {
			if (ctr > 0) result += columnDelimiter;

			result += item[key];
			// eslint-disable-next-line no-plusplus
			ctr++;
		});
		result += lineDelimiter;
	});

	return result;
}

function downloadCSV(array) {
	const link = document.createElement('a');
	let csv = convertArrayOfObjectsToCSV(array);
	if (csv == null) return;

	const filename = 'reporte.csv';

	if (!csv.match(/^data:text\/csv/i)) {
		csv = `data:text/csv;charset=utf-8,${csv}`;
	}

	link.setAttribute('href', encodeURI(csv));
	link.setAttribute('download', filename);
	link.click();
}

const exportPDF = (datos) => {
  const unit = "pt";
  const size = "A4"; // Use A1, A2, A3 or A4
  const orientation = "portrait"; // portrait or landscape

  const marginLeft = 40;
  const doc = new jsPDF(orientation, unit, size);

  doc.setFontSize(15);

  const title = "Reporte lectura";
  const headers = [["Tag", "Metraje","#Censos","%Lectura"]];

  const data = datos.map(elt=> [elt.tag, elt.metraje, elt.censo, elt.lectura]);

  let content = {
    startY: 50,
    head: headers,
    body: data
  };

  doc.text(title, marginLeft, 40);
  doc.autoTable(content);
  doc.save("reporte.pdf")
}


const Export = ({ onExport }) => <IconButton color="primary" onClick={e => onExport(e.target.value)}><FontAwesomeIcon icon={faFileCsv} /></IconButton>;
const ExportPdf = ({ onExport }) => <IconButton color="secondary" onClick={e => onExport(e.target.value)}><FontAwesomeIcon icon={faFilePdf} /></IconButton>;


const ExportDireccional = ({ onExport }) => <Button variant="contained" color="primary" onClick={e => onExport(e.target.value)} endIcon={<FontAwesomeIcon icon={faFileCsv} />}>Descargar Direccional</Button>;
const ExportOmniDireccional = ({ onExport }) => <Button variant="contained" style={{backgroundColor:'#A569BD'}} onClick={e => onExport(e.target.value)} endIcon={<FontAwesomeIcon icon={faFileCsv} />}>Descargar OmniDreccional</Button>;

 
const dataTablas = [
{idPrueba:"",antena:"",metraje:"",prueba:"",fecha:"",horaInicial:"",tag:"",horaTag:"",tiempoEstimado:""},
];

const  data = [
  {tag:"",metraje:"",censo:"",lectura:""},
 
 ];

const columns = [
    {
        name: 'Tag',
        selector: row => row.tag,
    },
    {
        name: 'Metraje',
        selector: row => row.metraje,
    },
    {
        name: '#Censos',
        selector: row => row.censo,
    },
    {
        name: '%Lectura',
        selector: row => row.lectura,
    },
];

const BotonesTablas = (props) =>{
  const handleOpen = () => props.setModal(true);

  return (
    <>
    {props.isBuscado ? (
          <Grid container spacing={2} 
            direction="row"
            justifyContent="center"
            alignItems="center">
          <Grid item xs={4}>
          <Tooltip title={"Descargar " + props.listaD.length + " registros"}>
          <div>
          <ExportDireccional onExport={() => downloadCSVTablas(props.listaD,"Direccional")} />
          </div>
          </Tooltip>
          </Grid>
          <Grid item xs={4}>
          <Tooltip title={"Descargar " + props.listaO.length + "  registros"}>
          <div>
          <ExportOmniDireccional  onExport={() => downloadCSVTablas(props.listaO,"Omnidireccional")} />
          </div>
          </Tooltip>
          </Grid>
          <Grid item xs={4}>
          <Tooltip title="Eliminar prueba">
          <div>
          <Button  variant="contained" style={{backgroundColor:'#E74C3C'}} endIcon={<FontAwesomeIcon icon={faTrash} />}   onClick={handleOpen}>
            Eliminar prueba
            </Button>
          </div>
          </Tooltip>
          </Grid>
          </Grid>)
          :<span></span>
          }

    </>
  );
}

const AccionesTabla = (props) => {
    return (
        <>
        <Tooltip title="CSV">
          <div>
            <Export onExport={() => downloadCSV(props.lista)} />     
          </div>
          </Tooltip>
        <Tooltip title="PDF">
          <div>            
            <ExportPdf onExport={() => exportPDF(props.lista)} />              
          </div>
        </Tooltip> 
        </>
    );

}

const MyComponent = (props) => {

//	const [rows, setRows] = useState([]);
    const actionsMemo = useMemo(() => <AccionesTabla lista={props.row} />, [props.row]);

	useEffect(() => {
		const timeout = setTimeout(() => {
			//setRows(data);
			props.set(false);
		}, 2000);
		return () => clearTimeout(timeout);
	}, [props]);

    return (
        <DataTable
            columns={columns}
            data={props.row}   
            progressComponent={<CircularProgress  />}
            progressPending={props.isPendiente}
            pagination 
            actions={actionsMemo} 
            theme='dark'
        />
    );
};

const NumPrueba = (props) => {
 
    const HandleChangeNumPruebs = async (event)  => {     
       props.set(event.target.value); 
      };
      const valores = [
        "01",
        "02",
        "03"
      ];
    return(
        <>
        <FormControl fullWidth >
       
      
        <TextField
         id="outlined-basic"
         label="#Prueba"
         variant="outlined"        
         defaultValue={valores[0]}
         onChange={HandleChangeNumPruebs}
         style={{height:"30px"}}

         />
        </FormControl>
        </>
    );
    /*
      <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={props.valor}
          label="Num prueba"
          defaultValue={valores[0]}
          displayEmpty
          onChange={HandleChangeNumPruebs}
          style={{height:"30px"}}
        >
          
          { valores.map((row) =>
          <MenuItem value={row}>{row}</MenuItem>          
          )}
        </Select>
    */
}

const TagSelect = (props) => {
 
    const handleChangeTag = (event) => {
        props.set(event.target.value);
      };
      const valores = [
        "2013",
        "2006",
        "2005"
      ];
   
    return(
        <>
        <FormControl fullWidth>

        <TextField
         id="outlined-basic"
         label="Tag"
         variant="outlined"        
         defaultValue={valores[0]}
         onChange={handleChangeTag}
         style={{height:"30px"}}

         />
        </FormControl>
        </>
    );
    /*
            <InputLabel id="demo-simple-select-label-2"  >Tag</InputLabel>
        <Select
          labelId="demo-simple-select-label-2"
          id="demo-simple-select-2"
          value={props.valor}
          label="Tag"
         // defaultValue="selecciona un tag"
          displayEmpty          
          onChange={handleChangeTag}
          style={{height:"30px"}}
        >
         { valores.map((row) =>
          <MenuItem value={row}>{row}</MenuItem>          
          )}
        
        </Select>
    */
}

const Fecha = (props) => {
   
  
    return (
      <div>
      
        <FormControl fullWidth >
         
          <DateTimePicker onChange={props.set} value={props.valor} format="y-MM-dd"  style={{height:"40px"}}/>
         
        </FormControl>
       
      </div>
    );
}

const BasicModal = (props) => {


  const handleClose = () => props.setModal(false);
  const Eliminar = () => {
    var fecha = format(props.fecha, "y-MM-dd");
    let headersList = {
      "Accept": "*/*",
      "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      "Content-Type": "application/json"
     }
     
     let bodyContent = JSON.stringify({
         "fecha": fecha,
         "prueba": props.prueba
       
     });
     
     fetch("192.168.100.42/apis/apis/eliminarRegistros.php", { 
       method: "POST",
       body: bodyContent,
       headers: headersList
     }).then(function(response) {
       return response.text();
     }).then(function(data) {
      const jsonConverido = JSON.parse(data);
           
     let mensaje = jsonConverido["mensaje"];
      if(mensaje === "exitoso"){
        props.setAlerta(true);
      }
       handleClose();
     })
  }

  return (
    <div>
      
      <Modal
        open={props.isModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Alerta
          </Typography>
          
       
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Se borraran registros de la prueba {props.prueba} en Direccional, OmniDreccional y Comparativas
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 3 }}>
            Seguro que quieres CONTINUAR?
          </Typography>
          <br/>
          <Button  variant="contained" style={{backgroundColor:'#E74C3C', width:'100%'}} endIcon={<FontAwesomeIcon icon={faTrash} />} onClick={Eliminar}>
           Continuar
            </Button>
        </Box>
      </Modal>
    </div>
  );
}

const PageBody = () => {
    let [datos, setDatos] = useState([]);    
    let [datosD, setDatosD] = useState([]);  
    let [datosO, setDatosO] = useState([]);  
    const [isBusqueda, setIsBusqueda] = React.useState(false);
    const [pruebaNum, setPruebaNum] = useState('01');
    const [tag, setTag] = useState('2013');
    const [value, onChange] = useState(new Date());
    const [pending, setPending] = useState(true);
    const [isAlerta, setIsAlerta] = React.useState(false);
    const [isAlertaSuccess, setIsAlertaSuccess] = React.useState(false);
    const [openModal, setOpenModal] = React.useState(false);
    
    var fechas = format(value, "y-MM-dd");
  
  
    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setIsAlerta(false);
    };
    const handleCloseSuccsess = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setIsAlertaSuccess(false);
    };


    const GetData = async () => {

     
     var fechaFormato = format(value, "y-MM-dd");
    

      let valuesArray = [];
      let lista = [];
      const response = [];
      let headersList = {
        "Accept": "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json"
       }
       
       let bodyContent = JSON.stringify({
           "fecha": fechaFormato,
           "prueba":pruebaNum,
           "tag": tag
       });
       
       await fetch("http://192.168.100.42/apis/apis/lecturas.php", { 
         method: "POST",
         body: bodyContent,
         headers: headersList
       }).then(function(response) {
         //console.log(response.text())
         return response.text();
       }).then(function(data) {
         const jsconConverido = JSON.parse(data);
        
          valuesArray = jsconConverido["lista"];
          if(valuesArray.length > 0){  
              for (const row of valuesArray) {
              
              let  objeto =  {
                  tag:row.tag,
                  metraje:row.metraje,
                  censo:row.censos,
                  lectura:row.porcentajeLecturas.toFixed(2) + " %"
                };
            
                lista.push(objeto);
                objeto = {};
              }
          }else{
            setIsAlerta(true);
          }

           setDatos(lista);
       })

       GetDataD();
       GetDataO();

       setPending(true);
        setTimeout(() => {         
        setPending(false);
       }, 2500);
       return response;
     }
    
     const GetDataD = async () => {

     
      var fechaFormato = format(value, "y-MM-dd");
     
  
       let valuesArray = [];
       let lista = [];
       const response = [];
       let headersList = {
         "Accept": "*/*",
         "User-Agent": "Thunder Client (https://www.thunderclient.com)",
         "Content-Type": "application/json"
        }
        
        let bodyContent = JSON.stringify({
            "fecha": fechaFormato,
            "prueba":pruebaNum,
            "tag": tag
        });
        
        await fetch("http://192.168.100.42/apis/apis/registrosD.php", { 
          method: "POST",
          body: bodyContent,
          headers: headersList
        }).then(function(response) {
          //console.log(response.text())
          return response.text();
        }).then(function(data) {
          const jsconConverido = JSON.parse(data);
          console.log(data)
           valuesArray = jsconConverido["listaD"];
           
          if(valuesArray.length > 0){  
               for (const row of valuesArray) {
               
               let  objeto =  {
                idPrueba: row.id_prueba,
                antena: row.antena,
                metraje: row.metraje,
                prueba: row.prueba,
                fecha: row.fecha,
                horaInicial: row.hora_inicial + "",
                tag: row.tag,
                horaTag: row.hora_tag + "",
                tiempoEstimado: row.tiempo_estimado + ""
                 };
             
                 lista.push(objeto);
                 objeto = {};
               }
               console.log(valuesArray.length);
           }else{
             setIsAlerta(true);
           }
  
            setDatosD(lista);
        })
  
  
      
        return response;
      }

      const GetDataO = async () => {

     
        var fechaFormato = format(value, "y-MM-dd");
       
    
         let valuesArray = [];
         let lista = [];
         const response = [];
         let headersList = {
           "Accept": "*/*",
           "User-Agent": "Thunder Client (https://www.thunderclient.com)",
           "Content-Type": "application/json"
          }
          
          let bodyContent = JSON.stringify({
              "fecha": fechaFormato,
              "prueba":pruebaNum,
              "tag": tag
          });
          
          await fetch("http://192.168.100.42/apis/apis/registrosO.php", { 
            method: "POST",
            body: bodyContent,
            headers: headersList
          }).then(function(response) {
           
            return response.text();
          }).then(function(data) {
            const jsconConverido = JSON.parse(data);
           
             valuesArray = jsconConverido["listaO"];
            
            if(valuesArray.length > 0){  
                 for (const row of valuesArray) {
                 
                 let  objeto =  {
                      idPrueba: row.id_prueba,
                      antena: row.antena,
                      metraje: row.metraje,
                      prueba: row.prueba,
                      fecha: row.fecha,
                      horaInicial: row.hora_inicial + "",
                      tag: row.tag,
                      horaTag: row.hora_tag + "",
                      tiempoEstimado: row.tiempo_estimado + ""
                   };
               
                   lista.push(objeto);
                   objeto = {};
                 }
             }else{
               setIsAlerta(true);
             }
    
              setDatosO(lista);
          })
    
    
          setPending(true);
           setTimeout(() => {         
           setPending(false);
          }, 2500);
          return response;
        }



     useEffect(()=>{GetData();},[]);

    return(
        <>
         <AppBar position="fixed" color="inherit">
         <div style={{padding:"10px"}} >
            <Grid container spacing={2}>
            <Grid item xs={2}>
            <Typography variant="h6" component="div" gutterBottom  style={{color:'black'}}>
                Reporte-Lectura
            </Typography>
          </Grid>
            <Grid item xs={2}>
             
              
              <Fecha valor={value} set={onChange}/>
                </Grid>
                <Grid item xs={2}>
           
              <NumPrueba  valor={pruebaNum} set={setPruebaNum}/>
                </Grid>
                <Grid item xs={2}>
            
              <TagSelect valor={tag} set={setTag}/>
                </Grid>
                <Grid item xs={2} >
                 
                <Tooltip title="Buscar">
                <Button variant="contained" endIcon={ <FontAwesomeIcon icon={faSearch} />}  onClick={() => {GetData(); setIsBusqueda(true)}}  size="small">
                  Buscar
                </Button>
              
                 </Tooltip>

                 
                </Grid>
            </Grid>
            </div>
         </AppBar>
        
        <div style={{paddingTop:'120px',paddingLeft:"40px", paddingRight:"40px",paddingBottom:"40px"}}>
        <BotonesTablas isBuscado={isBusqueda} setIsBuscado={setIsBusqueda} listaD={datosD} listaO={datosO}  setModal={setOpenModal} />
        <BasicModal isModal={openModal} setModal={setOpenModal} fecha={value} prueba={pruebaNum} setAlerta={setIsAlertaSuccess}/>
        <br/>
       
          <Snackbar open={isAlerta} autoHideDuration={3000} onClose={handleClose} TransitionComponent={Transition}  >
            <Alert onClose={handleClose} severity="warning" sx={{ width: '100%' }}>
              Sin coincidencias en fehca:{fechas}  prueba: {pruebaNum} tag: {tag} !
            </Alert>
          </Snackbar>
          <Snackbar open={isAlertaSuccess} autoHideDuration={3000} onClose={handleCloseSuccsess} TransitionComponent={Transition}  >
            <Alert onClose={handleCloseSuccsess} severity="success" sx={{ width: '100%' }}>
              Se elimino prueba !
            </Alert>
          </Snackbar>
       
          <MyComponent isPendiente={pending} set={setPending} row={datos}/>
         
        </div>
        </>
    );
}

export default PageBody;
