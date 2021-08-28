import React, { useState,useEffect } from 'react';
import api from '../../servicos/api';
import history from '../../history'
import '../../app.css'
import Header from '../../Components/Header'
import './listaContasPagar.css'
import ReactLoading from 'react-loading';
function ListarContasPagar()
{
    const [tipo,setTipo]=useState(0);
    const [tipos,setTipos]=useState([]);
    const [conCod,setConCod] = useState(0);
    const [dtInicio,setDtInicio] = useState('');
    const [dtFim,setDtFim] = useState('');
    const [parcelas,setParcelas] = useState([]);
    const [nome,setNome]=useState('');
    var tpPagamento;
    useEffect(()=>{
        localStorage.removeItem("cod_des");
        listarTipoDespesa();
    },[]);
    async function listarTipoDespesa(){
        await api.get(`/tipodespesa`).then((response)=>{
            
            setTipos(response.data);
        })
       
    }
    function voltarHome(){
        history.goBack();
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
    function getDtPgto(date){

        if(date==null)
            return 'Não pago';
        return mudarEstruturaData(date);
    }
    async function pesquisar(){
        await api.get(`/contasFiltro/?td_cod=${tipo}&dtInicio=${dtInicio}&dtFim=${dtFim}`).then((resp)=>{
       
            setParcelas(resp.data);
           console.log(resp.data);
        })
    }
    async function confirmarPagamento(con_cod,des_cod){
        await api.put('/contaPagar',{
            des_cod: des_cod,
            con_cod: con_cod,
            con_dtPgto: new Date()
        })
        pesquisar();   
    }
    async function btnClickCancelarPgto(con_cod,des_cod){
        await api.put('/contaPagar',{
            des_cod: des_cod,
            con_cod:con_cod,
            con_dtPgto:null,
        })
        pesquisar();
    }
    return (

        <div id="tela" className="background">
            <Header/>
            <div class="div-despesas">
                <h1>Contas a Pagar</h1>
                <form class="formularioDespesas">
                    <div class="filtro-despesas">
                            
                            <label>Tipo de despesas:</label>
                            <select id="select-tipodespesa" value={tipo} onChange={e=>setTipo(e.target.value)}>
                                <option id="op-selecione" value='0'>
                                    Selecione uma opcao
                                </option>
                                {tipos.map(tipo=>(
                                    <option key={tipo.td_cod} value={tipo.td_cod} >
                                        {tipo.td_nome}
                                    </option>
                                ))}
                            </select>
                            <label htmlFor="dtInicio">Data de Inicio: </label>
                            <input type="date" name="dtInicio" id="dtInicio" value={dtInicio} onChange={e=>setDtInicio(e.target.value)}/>
                            <label >Data de Fim: </label>
                            <input type="date" name="dtFim" id="dtFim" value={dtFim} onChange={e=>setDtFim(e.target.value)}/>
                            <div className="div-filtrarDespesa">
                                <button type="button" onClick={()=>pesquisar()} className="button-filtrarDespesa">Pesquisar</button>  
                            </div>  
                    </div>    
                    <div className="div-despesasT">
                        <table class='tabelaDes'>
                            <thead>
                                <tr>
                                    <td className="tdD-tipo">Tipo</td>
                                    <td className="tdD-dtParcelas">Nº</td>
                                    <td className="tdD-valor">Valor</td>
                                    <td className="tdD-dtVencimento">Data de vencimento</td>
                                    <td className="tdD-dtPgto">Data de Pagamento</td>
                                    <td>Ações</td>
                                </tr>
                            </thead>
                            <tbody className="tbodycolor">
                            {parcelas.map(res=>(
                                <tr key={[res.des_cod,res.con_cod]}>
                                    <td>{res.td_nome}</td>
                                    <td>{res.con_cod}</td>
                                    <td>R$ {parseFloat(res.con_valor).toFixed(2)}</td>
                                    <td>{mudarEstruturaData(res.con_dtVencimento)}</td>
                                    <td>{getDtPgto(res.con_dtPgto)}</td>
                                    <td>
                                    <button type="button" onClick={()=>confirmarPagamento(res.con_cod,res.des_cod)} disabled={res.con_dtPgto!==null} className="button-item-confirma">Confirmar </button>
                                    <button type="button" onClick={()=>btnClickCancelarPgto(res.con_cod,res.des_cod)} disabled={res.con_dtPgto===null} className="button-item-cancela">Cancelar Recebimento</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        </table>
                       
                    </div> 
                    
                </form> 
                
            </div>
            
            
        </div>
       
    );
}

export default ListarContasPagar;