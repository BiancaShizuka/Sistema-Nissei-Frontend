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
    function acessarServico(cod_ser,cod_cli){
        localStorage.setItem('cod_ser',cod_ser);
        localStorage.setItem('cod_cli',cod_cli);
        console.log("cod_ser: "+cod_ser+"  cod_cli"+cod_cli);
        history.push('/cadastroServico');
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
    <div id="tela" class="background">
        <Header/>
        <div class="lista-servicos"> 
            <div class='filtro'>
                <div class="filtro-cliente">
                    <label htmlFor="cliente">Cliente: </label>
                    <input type="text" name="cliente" id="cliente" value={cliente} onChange={e=>setCliente(e.target.value)}/>
                </div>
                <div class="filtro-placa">
                    <label htmlFor="placa">Placa: </label>
                    <input type="text" name="placa" id="placa" value={placa} onChange={e=>setPlaca(e.target.value)}/>
                </div>
                <div class="filtro-dataInicio" >
                    <label htmlFor="dtInicio">Data de inicio: </label>
                    <input type="date" name="dtInicio" id="dtInicio" value={dtInicio} onChange={e=>setDtInicio(e.target.value)} required/>
                </div>
                <div class="filtro-dataFim">
                    <label htmlFor="dtInicio">Data de fim: </label>
                    <input type="date" name="dtInicio" id="dtInicio" value={dtSaida} onChange={e=>setDtSaida(e.target.value)} required/>
                </div>
                <div class="filtro-status">
                    <label>Status do Serviço: </label>
                    <select class="select-status" value={status} onChange={e=>setStatus(e.target.value)}>
                            <option id="op-selecione" value="">Selecione uma opcao</option>
                            <option id="op-selecione" value="0">Encerrado</option>
                            <option id="op-selecione" value="1">Em andamento</option>
                    </select>
                </div>
                <p class="p-filtrar"><button type="button" class="button-filtrar" onClick={()=>filtrar()}>Filtrar</button></p>
            </div>
            <div class="tabela-servicos">   
                <table class='tableSer'>
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
                                <button onClick={()=>acessarServico(res.ser_cod,res.cliente.pes_cod)} disabled={res.ser_fim!=null} class="button-tabServico">Editar</button>
                                <button onClick={()=>visualizarServico(res.ser_cod)} class="button-tabServico">Visualizar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {loading &&
                    <div class="modalTabelaServico">
                        <ReactLoading type={"spinningBubbles"} color={"#ffffff"} height={'20%'} width={'20%'} />
                    </div>
                }
            </div>
            <button type="button" onClick={voltarHome} class="buttonBack">Voltar</button>
        </div>
    </div>
    );
}
export default ListaServicos;
