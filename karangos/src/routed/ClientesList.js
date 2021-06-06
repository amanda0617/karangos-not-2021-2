import { useState, useEffect } from 'react'
import axios from 'axios'
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import AddBoxIcon from '@material-ui/icons/AddBox';
import { useHistory } from 'react-router-dom'
import ConfirmDialog from '../ui/ConfirmDialog'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { DataGrid } from '@material-ui/data-grid'

const useStyles = makeStyles(theme => ({
    table: {
      minWidth: 650,
    },
    dataGrid: {
      '& .MuiDataGrid-row button': {       // Esconde os botões na linha de tabela "normal"
        visibility: 'hidden'
      },
      '& .MuiDataGrid-row:hover button': { // Exibe os botões de volta quando o mouse passar por cima
        visibility: 'visible'
      }
    },
    toolbar: {
      justifyContent: 'flex-end',
      paddingRight: 0,
      margin: theme.spacing(2, 0)
    }
  }));

  export default function ClientesList() {
    const classes = useStyles()

    // Variáveis que conterão dados PRECISAM ser inicializadas como vetores vazios
  const [cliente, setCliente] = useState([])
  const [deletable, setDeletable] = useState()        // Código do registro a ser excluído
  const [dialogOpen, setDialogOpen] = useState(false) // O diálogo de confirmação está aberto?
  const [sbOpen, setSbOpen] = useState(false)
  const [sbSeverity, setSbSeverity] = useState('success')
  const [sbMessage, setSbMessage] = useState('Exclusão realizada com sucesso.')
  const [gridLoading, setGridLoading] = useState(false)

  const history = useHistory()

  useEffect(() => {
    setTimeout(() => getData(), 100)
  }, []) // Quando a lista de dependências é um vetor vazio, o useEffect()
         // é executado apenas uma vez, no carregamento inicial do componente

   async function getData() {
    try { // tenta buscar os dados
        setGridLoading(true)
        let response = await axios.get('https://api.faustocintra.com.br/clientes?by=nome')
        if(response.data.length > 0) setCliente(response.data)
    }
    catch(error) {
        console.error(error)
    }
    setGridLoading(false)
    }

    async function deleteItem() {
        try {
          await axios.delete(`https://api.faustocintra.com.br/clientes/${deletable}`)
          getData()     // Atualiza os dados da tabela
          setSbSeverity('success')
          setSbMessage('Exclusão efetuada com sucesso.')
        }
        catch(error) {
          setSbSeverity('error')
          setSbMessage('ERRO: ' + error.message)
        }
        setSbOpen(true)   // Exibe a snackbar
      }

      function handleDialogClose(result) {
        setDialogOpen(false)
    
        // Se o usuário concordou com a exclusão 
        if(result) deleteItem()
      }
    
      function handleDelete(id) {
        setDeletable(id)
        setDialogOpen(true)
      }
    
      function handleSbClose() {
        setSbOpen(false)    // Fecha a snackbar
      }

      const columns = [
        { 
          field: 'id', 
          headerName: 'Cód.',
          align: 'right',
          headerAlign: 'right',  
          flex: true,
          disableColumnMenu: true,
          sortComparator: (v1, v2) => Number(v1) > Number(v2) ? 1 : -1
        },
        { 
            field: 'nome', 
            headerName: 'Nome',
            flex: true 
          },
          { 
            field: 'cpf', 
            headerName: 'CPF',
            flex: true 
          },
          { 
            field: 'rg', 
            headerName: 'RG',
            flex: true 
          },
          { 
            field: 'logradouro', 
            headerName: 'Logradouro',
            flex: true 
          },
          { 
            field: 'num_imovel', 
            headerName: 'Número Imóvel',
            flex: true 
          },
          { 
            field: 'complemento', 
            headerName: 'Complemento',
            flex: true 
          },
          { 
            field: 'bairro', 
            headerName: 'Bairro',
            flex: true 
          },
          { 
            field: 'municipio', 
            headerName: 'Município',
            flex: true 
          },
          { 
            field: 'uf', 
            headerName: 'UF',
            align: 'center',
            headerAlign: 'center', 
            flex: true 
          },
          { 
            field: 'telefone', 
            headerName: 'Telefone',
            flex: true 
          },
          { 
            field: 'email', 
            headerName: 'Email',
            flex: true 
          },
          { 
            field: 'editar',
            headerName: 'Editar',
            align: 'center', 
            headerAlign: 'center', 
            flex: true,
            renderCell: params => (
              <IconButton aria-label="editar" onClick={() => history.push(`/edite/${params.id}`)}>
                <EditIcon />
              </IconButton>
            )
          },
          { 
            field: 'excluir',
            headerName: 'Excluir',
            align: 'center', 
            headerAlign: 'center', 
            flex: true,
            renderCell: params => (
              <IconButton aria-label="excluir" onClick={() => handleDelete(params.id)}>
                <DeleteIcon color="error" />
              </IconButton>
            )
          },
        ];

        return (
            <>
              <ConfirmDialog isOpen={dialogOpen} onClose={handleDialogClose}>
                Deseja realmente excluir este cliente?
              </ConfirmDialog>
              
              <Snackbar open={sbOpen} autoHideDuration={6000} onClose={handleSbClose}>
                <MuiAlert elevation={6} variant="filled" onClose={handleSbClose} severity={sbSeverity}>
                  {sbMessage}
                </MuiAlert>
              </Snackbar>

              <h1 onClick={() => getData()}>Listagem de Clientes</h1>
      <Toolbar className={classes.toolbar}>
        <Button color="secondary" variant="contained" size="large" 
          startIcon={<AddBoxIcon />} onClick={() => history.push('/novo')}>
          Novo Cliente
        </Button>
      </Toolbar>
      <Paper elevation={4}>
        <DataGrid className={classes.dataGrid} rows={cliente} columns={columns} pageSize={14} autoHeight={true} loading={gridLoading} disableSelectionOnClick={true} />
      </Paper>
    </>
  )
}