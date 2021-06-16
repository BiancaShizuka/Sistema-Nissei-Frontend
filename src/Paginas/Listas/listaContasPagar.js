import React, { useState,useEffect } from 'react';
import api from '../../servicos/api';
import history from '../../history'
import '../../app.css'
import Header from '../../Components/Header'
import './listaContasPagar.css'
import ReactLoading from 'react-loading';
function ListarContasPagar()
{
    const [showModal,setShowModal]=useState(false);
    const [showModalCancel,setShowModalCancel]=useState(false);
    const [conCod,setConCod] = useState(0);
    const [desCod,setSerCod] = useState(0);
    const [dtVencimento,setDtVencimento] = useState('');
    const [dtPgto, setDtPgto] = useState(new Date());
    const [loading,setLoading]=useState(false);
    const [parcelas,setParcelas] = useState([]);
    const [nome,setNome]=useState('');
    var tpPagamento;
    useEffect(()=>{
        localStorage.removeItem("cod_des");
   
    },[]);
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
    async function pesquisar(){
        setLoading(true);
        await api.get(`/buscarContasPagar/?td_nome=${nome}&con_dtVencimento=${dtVencimento}`).then((resp)=>{
       
            setParcelas(resp.data);
        })
        setLoading(false);
    }
    if(conCod>1)
    {
        tpPagamento="Parcelado";
    }
    else
    {
        tpPagamento="A vista";
    }
    return (

        <div id="tela" className="background">
            <Header/>
            <div class="div-despesas">
                <h1>Contas a Pagar</h1>
                <form class="formularioDespesas">
                    <div class="filtro-despesas">
                            <label >Tipo de Despesas: </label>
                            <input type="text"/>
                            <label >Data de Lançamento: </label>
                            <input type="date"/>
                            <label >Data de Vencimento: </label>
                            <input type="date"/>
                            <div className="div-filtrarDespesa">
                                <button type="button" onClick={()=>pesquisar()} className="button-filtrarDespesa">Pesquisar</button>  
                            </div>  
                    </div>    
                    <div className="div-despesasT">
                        <table class='tabelaDes'>
                            <thead>
                                <tr>
                                    <td className="tdD-tipo">Tipo</td>
                                    <td className="tdD-valor">Valor</td>
                                    <td className="tdD-dtVencimento">Data de vencimento</td>
                                    <td className="tdD-dtParcelas">Número de Parcelas</td>
                                    <td className="tdD-tipoPgto">Tipo de Pagamento</td>
                                    <td className="tdD-dtPgto">Data de Pagamento</td>
                                </tr>
                            </thead>
                            <tbody className="tbodycolor">
                            {parcelas.map(res=>(
                                <tr key={[res.des_cod]}>
                                    <td>{res.nome}</td>
                                    <td>R$ {parseFloat(res.con_valor).toFixed(2)}</td>
                                    <td>{mudarEstruturaData(res.con_dtVencimento)}</td> 
                                    <td>{tpPagamento}</td>
                                    <td>{res.con_cod}</td>
                                    <td>{mudarEstruturaData(res.con_dtPgto)}</td>
                                </tr>
                            ))}
                        </tbody>
                        </table>
                       
                    </div> 
                    <button type="button" onClick={voltarHome} className="buttonBack">Voltar</button>
                </form> 
            </div>
        </div>
       
    );
}

export default ListarContasPagar;