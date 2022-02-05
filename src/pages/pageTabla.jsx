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
    InputLabel  ,
    CircularProgress,
    IconButton,
    Tooltip  ,
    MenuItem ,
    Select,
    FormControl ,
    AppBar  ,
    Button ,
    Snackbar ,
     
      
} from '@mui/material/';
import MuiAlert from '@mui/material/Alert';
//dependecias extra
import DataTable from 'react-data-table-component';//datatable para react
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faFileCsv,
    faFilePdf ,
    faSearch
} from '@fortawesome/free-solid-svg-icons';
import DateTimePicker from 'react-datetime-picker';
import jsPDF from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";
import Slide from '@material-ui/core/Slide';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
function Transition(props) {
  return <Slide {...props} direction="left" />;
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

//const ExpandedComponent = ({ data }) => <pre>{JSON.stringify(data, null, 2)}</pre>;
const Export = ({ onExport }) => <IconButton color="primary" onClick={e => onExport(e.target.value)}><FontAwesomeIcon icon={faFileCsv} /></IconButton>;
const ExportPdf = ({ onExport }) => <IconButton color="secondary" onClick={e => onExport(e.target.value)}><FontAwesomeIcon icon={faFilePdf} /></IconButton>;
 
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
        <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">#Prueba</InputLabel>
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
        </FormControl>
        </>
    );
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
        </FormControl>
        </>
    );
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

const PageBody = () => {
    let [datos, setDatos] = useState([]);
   
    const [pruebaNum, setPruebaNum] = useState('01');
    const [tag, setTag] = useState('2013');
    const [value, onChange] = useState(new Date());
    const [pending, setPending] = useState(true);
    const [isAlerta, setIsAlerta] = React.useState(false);
    var fechas = format(value, "y-MM-dd");
  
  
    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setIsAlerta(false);
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


       setPending(true);
        setTimeout(() => {         
        setPending(false);
       }, 2000);
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
                <Button variant="contained" endIcon={ <FontAwesomeIcon icon={faSearch} />}  onClick={GetData}  size="small">
                  Buscar
                </Button>
              
                 </Tooltip>

                 
                </Grid>
            </Grid>
            </div>
         </AppBar>
        
        <div style={{paddingTop:'120px',paddingLeft:"40px", paddingRight:"40px",paddingBottom:"40px"}}>

       
      <Snackbar open={isAlerta} autoHideDuration={3000} onClose={handleClose} TransitionComponent={Transition}  >
        <Alert onClose={handleClose} severity="warning" sx={{ width: '100%' }}>
          Sin coincidencias en fehca:{fechas}  prueba: {pruebaNum} tag: {tag}
        </Alert>
      </Snackbar>
       
        <MyComponent isPendiente={pending} set={setPending} row={datos}/>

        </div>
        </>
    );
}

export default PageBody;
