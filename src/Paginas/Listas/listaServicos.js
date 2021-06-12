import React, { useEffect, useState } from 'react';
import api from '../../servicos/api';
import history from '../../history'
import '../../app.css'
import './listaServicos.css'
import Header from '../../Components/Header'
import ReactLoading from 'react-loading';
function ListaServicos()
{

    const [cliente,setCliente]=useState('');
    const [dtInicio,setDtInicio]=useState('');
    const [dtSaida,setDtSaida]=useState('');
    const [placa,setPlaca]=useState('');
    const [status,setStatus]=useState('');
    const [servicos,setServicos]=useState([]);
    const [loading,setLoading]=useState(false);

    useEffect(()=>{
        localStorage.removeItem("cod_cli");
   
    },[]);

 
    function voltarHome(){
   
        history.goBack();
    }
    
    function getStatus(status){
        if(status===null)
            return 'Em andamento';
        return 'Finalizado'; 
    }

   
    function visualizarServico(cod){
        localStorage.setItem('cod_ser',cod);
        history.push('/visualizarServico');
    }
    async function filtrar(){
        setLoading(true);
        await api.get(`/servicoFiltro/?cliente=${cliente}&dt_inicio=${dtInicio}&dt_saida=${dtSaida}&car_placa=${placa}&status=${status}`).then((resp)=>{
            setServicos(resp.data);
        })
        setLoading(false);
    }
    function mudarEstruturaData(valor){
        var date=new Date(valor);
        let dat="";
        if(date.getDate()<10)
            dat+='0';
        dat+=date.getDate()+"/";
        if(date.getMonth()+1<10)
            dat+='0';
        dat+=(date.getMonth()+1)+"/";
        dat+=date.getFullYear();
        
        
        return dat;
    }
    function getFuncionario(func){
        if(func!==null){
            return func.pes_nome;
        }else{
            return "null";
        }
    }
    function getPlaca(carro){
        if(carro!==null){
            return carro.car_placa;
        }else{
            return "null";
        }
    }
    return (
    <div id="tela" className="background">
        <Header/>
        <div className="lista-servicos"> 
            <h1>Serviços</h1>
            <div className='filtro'>
                <div className="filtro-cliente">
                    <label htmlFor="cliente">Cliente: </label>
                    <input type="text" name="cliente" id="cliente" value={cliente} onChange={e=>setCliente(e.target.value)}/>
                </div>
                <div className="filtro-placa">
                    <label htmlFor="placa">Placa: </label>
                    <input type="text" name="placa" id="placa" value={placa} onChange={e=>setPlaca(e.target.value)}/>
                </div>
                <div className="filtro-dataInicio" >
                    <label htmlFor="dtInicio">Data de inicio: </label>
                    <input type="date" name="dtInicio" id="dtInicio" value={dtInicio} onChange={e=>setDtInicio(e.target.value)} required/>
                </div>
                <div className="filtro-dataFim">
                    <label htmlFor="dtInicio">Data de fim: </label>
                    <input type="date" name="dtInicio" id="dtInicio" value={dtSaida} onChange={e=>setDtSaida(e.target.value)} required/>
                </div>
                <div className="filtro-status">
                    <label>Status do Serviço: </label>
                    <select className="select-status" value={status} onChange={e=>setStatus(e.target.value)}>
                            <option id="op-selecione" value="">Selecione uma opcao</option>
                            <option id="op-selecione" value="0">Encerrado</option>
                            <option id="op-selecione" value="1">Em andamento</option>
                    </select>
                </div>
                <p className="p-filtrar"><button type="button" className="button-filtrar" onClick={()=>filtrar()}>Filtrar</button></p>
            </div>
            <div className="tabela-servicos">   
                <table className='tableSer'>
                    <thead>
                        <tr>
                            <td>Cliente</td>
                            <td>Funcionário</td>
                            <td>Carro</td>
                            <td>Data de inicio</td>
                            <td>Status</td>
                            <td>Acao</td>
                        </tr>
                    </thead>
                    <tbody>
                        {!loading && servicos.map(res=>(
                            <tr key={res.ser_cod}>
                                <td>{res.cliente.pes_nome}</td>
                                <td>{getFuncionario(res.funcionario)}</td>
                                <td>{getPlaca(res.carro)}</td>
                                <td>{mudarEstruturaData(res.ser_inicio)}</td>
                                <td>{getStatus(res.ser_fim)}</td>
                                <td>
                                <button onClick={()=>visualizarServico(res.ser_cod)} className="button-tabServico">Visualizar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {loading &&
                    <div className="modalTabelaServico">
                        <ReactLoading type={"spinningBubbles"} color={"#ffffff"} height={'20%'} width={'20%'} />
                    </div>
                }
            </div>
            <button type="button" onClick={voltarHome} className="buttonBack">Voltar</button>
        </div>
    </div>
    );
}
export default ListaServicos;
