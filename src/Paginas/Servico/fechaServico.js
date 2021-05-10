import React, { useEffect, useState } from 'react';
import api from '../../servicos/api';
import history from '../../history'
import './fechaServico.css'
import '../../app.css'
import Header from '../../Components/Header'
import ReactLoading from 'react-loading';
function FechaServico()
{
    const [disabledQtde,setDisabledQtde]=useState(false);
    const [qtdeParcela,setQtdeParcela]=useState(0);
    const [pgto,setPgto] = useState('vista')
    const [servico,setServico]=useState([]);
    const [pecsUti,setPecasUti] = useState([]);
    const [total,setTotal] = useState(0);
    const [valorParcela,setValorParcela]=useState(0);

    const [valorPecs,setValorPecs]=useState(0);
    const [showModal,setShowModal]=useState(false);
    const [parcelas,setParcelas]=useState([]);
    const [loading,setLoading]=useState(false);
    useEffect(()=>{
        listarServico();   
    },[]);
    useEffect(()=>{
        let i=0;
        let t=0;
        while(i<pecsUti.length){   
            t+=pecsUti[i].uti_precoUni*pecsUti[i].uti_qtde;
            i++;
        }
        setValorPecs(t);

    },[pecsUti]);
    useEffect(()=>{
        if(pgto==="vista"){
            setDisabledQtde(true);
            setQtdeParcela(1);
            setValorParcela(total);
        }
        else{
            setDisabledQtde(false);
            console.log(qtdeParcela);
            setValorParcela(total/qtdeParcela);
        }    
    },[pgto,qtdeParcela]);
    useEffect(()=>{
        if(pgto!=='vista')
            setQtdeParcela(2);
    },[pgto])
    async function listarServico(){
        setLoading(true);
        await api.get(`/servico/${localStorage.getItem('cod_ser')}`).then((resp)=>{
            setServico(resp.data);     
            setTotal(resp.data.total);
            setPecasUti(resp.data.pecas); 
            setValorParcela(resp.data.total);
            
        });
        setLoading(false);
        
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
    async function btnClickGerarConta(){
        setShowModal(true);
    }
    async function btnFecharModal(){
        setShowModal(false);
    }
    function btnClickVizualizar(){
        let date = new Date();
        
        let parcAux=[];
     
        for(var i=1;i<=qtdeParcela;i++){
            let date2 = date.setDate(date.getDate());
  
            let data= {
                    cod: i,
                    valor: valorParcela,
                    dtVenc: date2
                
                };
            date.setDate(date.getDate()+30);
            parcAux.push(data);
         
        }
   
        setParcelas(parcAux);
    }
    async function gerarContaReceber(){
        btnFecharModal();
        setLoading(true);
        await api.post('/fecharServico',{
            ser_cod: localStorage.getItem('cod_ser'),
            qtde_parcelas:qtdeParcela,

        })
        setLoading(false);
        voltarHome();
    }
   
    return (
    <div className='background'>
        <Header/>
        <div className="div-gerarConta">
            <h1>Fechar Serviço</h1>
            
            <div className="divtable-pecasuti">
                        <table id="tabelaCont">
                            <thead>
                                <tr>
                                    <td>Descrição</td>
                                    <td>Quantidade</td>
                                    <td>Valor Uni.</td>
                                    <td>Valor total</td>
                              
                                </tr>
                            </thead>
                            <tbody>
                                {pecsUti.map(pec=>(
                                    <tr key={pec.peca.pec_cod}>
                                        <td>{pec.peca.pec_descricao}</td>
                                        <td>{pec.uti_qtde}</td>
                                        <td>R$ {parseFloat(pec.uti_precoUni).toFixed(2)}</td>
                                        <td>R$ {parseFloat(pec.uti_qtde*pec.uti_precoUni).toFixed(2)}</td>
                                   
                                    </tr>
                                ))}
                            </tbody>
                        </table>
            </div>
            <p className="p-valorPecas">Valor total das peças:R$ {parseFloat(valorPecs).toFixed(2)}</p>
            <p className="p-maoObra">Valor da mão de obra: R$ {parseFloat(servico.ser_maoObra).toFixed(2)}</p>
            <p className="p-total">Total: R$ {parseFloat(total).toFixed(2)}</p>
            
            <div className="div-formaPgto">
                <label>Forma de Pagamento: </label>
                <select className="select-pgto" value={pgto} onChange={e=>setPgto(e.target.value)}>
                        <option value="vista">
                            À vista
                        </option>
                        <option value="parcelas">
                            Parcelas
                        </option>
                        
                </select>
            </div>
            <div className="div-qtdeParcela">
                <label>Quatidade de parcelas: </label>
                <input type="number" disabled={disabledQtde} min={2} max={3} className='input-qtdeParcela' value={qtdeParcela} onChange={e=>setQtdeParcela(e.target.value)} />
            </div>
            <div className="div-valorParcela">
                <label>Valor da Parcela: </label>
                <input type="number" disabled={true} value={parseFloat(valorParcela).toFixed(2)} className='input-valorParcela' onChange={e=>setValorParcela(e.target.value)} />
            </div>
            <div className="div-visucontasReceber">   
                <table className='table-visucontasReceber'>
                    <thead>
                        <tr>
                            <td className="td-cod">Nº</td>
                            <td className="td-valor">Valor da parcela</td>
                            <td className="td-dtVenc">Data de Vencimento</td>
                        </tr>
                    </thead>
                    <tbody>
                        {parcelas.map(res=>(
                            <tr key={res.cod}>
                                <td >{res.cod}</td>
                                <td >R$ {parseFloat(res.valor).toFixed(2)}</td>
                                <td >{mudarEstruturaData(res.dtVenc)}</td>
 
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button type="button" onClick={()=>btnClickVizualizar()} className="button-vizualizarConta">Vizualizar conta a receber</button>
            <button type="button" onClick={()=>btnClickGerarConta()} className="button-marca">Gerar conta a receber</button>
            <button type="button" onClick={voltarHome} className="button-voltarMarca">Voltar</button>
        </div>
        {loading &&
                    <div className="modalFechaServico">
                        <ReactLoading type={"spinningBubbles"} color={"#ffffff"} height={'20%'} width={'20%'} />
                    </div>
                }
        {showModal &&
            <div className="modal">
                <div className="modal-content">
                    <div className="modal-content-text"> 
                        <p>Deseja realmente fechar o serviço?</p>
                    </div>
                    <div className="modal-content-btns">
                        <button type="button" className="btn-confirma" onClick={gerarContaReceber}>Confirmar</button>
                        <button type="button" className="btn-cancela" onClick={btnFecharModal}>Fechar</button>
                    </div>
                </div>
            </div>
        }
    </div>
    );
}

export default FechaServico;