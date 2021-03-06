import React, { useState,useEffect } from 'react';
import api from '../../servicos/api';
import history from '../../history'
import '../../app.css'
import Header from '../../Components/Header'
import './listaContasReceber.css'
import ReactLoading from 'react-loading';
import { isElementOfType } from 'react-dom/test-utils';
function ListarContasReceber()
{
    const [showModal,setShowModal]=useState(false);
    const [showModalCancel,setShowModalCancel]=useState(false);
    const [conCod,setConCod] = useState(0);
    const [serCod,setSerCod] = useState(0);
    const [dtPgto, setDtPgto] = useState(new Date());
    const [dtInicio,setDtInicio] = useState('');
    const [dtFim,setDtFim] = useState('');
    const [status,setStatus] = useState('');
    const [parcelas,setParcelas] = useState([]);
    const [loading,setLoading]=useState(false);
    const [nomeCliente,setNomeCliente]=useState('');

    const [showModalPgtoParc,setShowModalPgtoParc] = useState(false);
    const [conValor,setConValor] = useState(0);
    const [valorParc,setValorParc] = useState(0);
    const [paiCon,setPaiCon] = useState(0);
    const [paiSer,setPaiSer] = useState(0);

    useEffect(()=>{
        localStorage.removeItem("cod_cli");
   
    },[]);
    function voltarHome(){
        history.goBack();
    }
    async function filtrar(){
        setLoading(true);
        await api.get(`/contaReceberFiltros/?dt_inicio=${dtInicio}&dt_fim=${dtFim}&status=${status}&cliente=${nomeCliente}`).then((resp)=>{
       
            setParcelas(resp.data);
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
    function getDtPgto(date){

        if(date==null)
            return 'Não pago';
        return mudarEstruturaData(date);
    }
    async function btnClickCancelarPgto(con_cod,ser_cod,pai_con,pai_ser){
        setConCod(con_cod);
        setSerCod(ser_cod);
        setPaiCon(pai_con);
        setPaiSer(pai_ser);
        setShowModalCancel(true);
    }
    async function btnFecharModalCancel(){
        setShowModalCancel(false);
    }
    async function btnClickConfPgto(con_cod,ser_cod){
        setSerCod(ser_cod);
        setConCod(con_cod);
        setShowModal(true);
    } 
    async function btnFecharModal(){
        setShowModal(false);
    }
    async function confirmarPagamento(){
        btnFecharModal();
        setLoading(true);
        await api.put('/contaReceber',{
            con_cod: conCod,
            ser_cod: serCod,
            con_dtPgto: dtPgto
        })
        filtrar();
    }
    function visualizarServico(ser_cod){
        localStorage.setItem('cod_ser',ser_cod);
        history.push('/visualizarServico');
    }
    async function cancelarRecebimento(){
        btnFecharModalCancel();
        setLoading(true);
        await api.put('/contaReceber',{
            con_cod: conCod,
            ser_cod: serCod,
            con_dtPgto: null   
        })
        filtrar();
    }

    async function fecharModalPgtoParc()
    {
        setShowModalPgtoParc(false); 
    } 
    async function btnFecharModalPgtoParc()
    {
        fecharModalPgtoParc();
    }

    async function pagarParc(){   
        
        fecharModalPgtoParc();
        setLoading(true);
        await api.put('/contaReceberParcial',{
            con_cod: conCod,
            ser_cod: serCod,
            con_valor: parseFloat(valorParc).toFixed(2),  
        })
        filtrar();      
    }
    
    return (
        <div id="tela" className="background">
            <Header/>   
                <div className="div-contasReceber">   
                    <h1>Contas a Receber</h1>
                    <div className="div-pesquisaConta">
                        <label htmlFor="dtInicio">Data de Inicio: </label>
                        <input className="input-dtInicio" type="date" name="dtInicio" id="dtInicio" value={dtInicio} onChange={e=>setDtInicio(e.target.value)} required/>
                
                
                        <label htmlFor="dtFim">Data de fim: </label>
                        <input className="input-dtFim" type="date" name="dtFim" id="dtFim" value={dtFim} onChange={e=>setDtFim(e.target.value)} required/>
                    
                        <label htmlFor="status">Status do pagamento: </label>
                        <select value={status} onChange={e=>setStatus(e.target.value)}>
                            <option id="op-selecione" value="">
                                Selecione uma opcao
                            </option>
                            <option id="pago" value="Recebimento efetuado">
                                Recebimento efetuado
                            </option>
                            <option id="pago" value="Aguardando recebimento">
                                Aguardando recebimeto
                            </option>
                        </select>
                        <label htmlFor="nomeCliente" className="label-nomeCliente">Cliente: </label>
                        <input className="input-nomeCliente" type="text" name="nomeCliente" id="nomeCliente" value={nomeCliente} onChange={e=>setNomeCliente(e.target.value)} />
                        <div className="div-buttonFiltrar">
                            <button type="button" onClick={()=>filtrar()} className="button-filtrarContasReceber">Filtrar</button>
                        </div>
                        
                    </div>
                    
                    <table className='table-contasReceber'>
                        <thead>
                            <tr>
                                <td className="td-cliente">Nome do Cliente</td>
                                <td className="td-num">Nº</td>
                                <td className="td-valor">Valor</td>
                                <td className="td-venc">Data de Vencimento</td>
                                <td className="td-pgto">Data de Recebimento</td>
                                <td>Acao</td>
                            </tr>
                        </thead>
                        <tbody className="tbodycolor">
                            {parcelas.map(res=>(
                                <tr key={[res.con_cod,res.ser_cod]}>
                                    <td>{res.cli_nome}</td>
                                    <td>{res.con_cod}</td>
                                    <td>R$ {parseFloat(res.con_valor).toFixed(2)}</td>
                                    <td>{mudarEstruturaData(res.con_dtVencimento)}</td>
                                    <td>{getDtPgto(res.con_dtPgto)}</td>
                                    <td>
                 

                               
                                    <button onClick={()=>btnClickConfPgto(res.con_cod,res.ser_cod)} disabled={res.con_dtPgto!==null} className="button-item-confirma">Confirmar </button>
                                    <button onClick={()=>btnClickCancelarPgto(res.con_cod,res.ser_cod, res.pai_con, res.pai_ser)} disabled={res.con_dtPgto===null} className="button-item-cancela">Cancelar Recebimento</button>
                                    <button onClick={()=>visualizarServico(res.ser_cod)} className="button-item-visualiza">Visualizar Serviço</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button type="button" onClick={voltarHome} className="buttonBack">Voltar</button>
                {loading &&
                    <div className="modalFechaServico">
                        <ReactLoading type={"spinningBubbles"} color={"#ffffff"} height={'20%'} width={'20%'} />
                    </div>
                }
                {showModal &&
                <div className="modal">
                    <div className="modal-content">
                        <div className="modal-content-text"> 
              
                            <p>Deseja realmente confirmar recebimento?</p>
                            
                            <input type="date"  value={dtPgto} onChange={e=>setDtPgto(e.target.value)} required/>
                        </div>
                        <div className="modal-content-btns">
                            <button type="button" className="btn-confirma" onClick={confirmarPagamento}>Confirmar</button>
                            <button type="button" className="btn-cancela" onClick={btnFecharModal}>Fechar</button>
                        </div>
                    </div>
                </div>
            }
            {showModalCancel &&
                <div className="modal">
                    <div className="modal-content">
                        <div className="modal-content-text"> 

                            <p>Deseja realmente cancelar recebimento?</p>
                     
                        </div>
                        <div className="modal-content-btns">
                            <button type="button" className="btn-confirma" onClick={cancelarRecebimento}>Confirmar</button>
                            <button type="button" className="btn-cancela" onClick={btnFecharModalCancel}>Fechar</button>
                        </div>
                    </div>
                </div>
            }
            {showModalPgtoParc &&
                <div className="modal">
                    <div className="modal-content-pgto"> 
                        <div className="modal-content-text">
                            <p>Valor da parcela: R$ {parseFloat(conValor).toFixed(2)}
                            <br></br><br></br>Qual o valor que deseja pagar?</p>

                            <p><label htmlFor="valorParc">R$ </label>
                            <input name="valorParc" id="valorParc" type="number" value={valorParc} onChange={e=>setValorParc(e.target.value)} required/>
                            </p>

                        </div>
                        <div clasName="modal-content-btns">
                            <button type="button" className="btn-confirma" onClick={pagarParc}disabled={valorParc<=0 || valorParc > conValor}>Confirmar</button>
                            <button type="button" className="btn-cancela" onClick={btnFecharModalPgtoParc}>Fechar</button>
                        </div>
                    </div>
                </div>    
            }

        </div>

    );
}
export default ListarContasReceber;