import React, { useEffect, useState } from 'react';
import history from '../../history';
import './visualizarServiço.css';
import api from '../../servicos/api';
import Header from '../../Components/Header'
function VisualizarServiço()
{
    const [carro,setCarro]=useState('');
    const [cliente,setCliente]=useState('');
    const [funcionario,setFuncionario]=useState('');
    const [descricao,setDescricao]=useState('');
    const [dtInicio,setDtInicio]=useState('');
    const [dtFim,setDtFim]=useState('');
    const [maoObra,setMaoObra]=useState('0');
    const [total,setTotal]=useState(0);
    const [pecsUti,setPecasUti] = useState([]);
    const [status,setStatus] = useState(false);


    const [showModal,setShowModal]=useState(false);
    const [showModalAviso,setShowModalAviso]=useState(false);
    useEffect(()=>{
        recuperarServico();
        
    },[])
    async function recuperarServico(){
        await api.get(`/servico/${localStorage.getItem('cod_ser')}`).then((resp)=>{
            if(resp.data.carro!==null)
                setCarro(resp.data.carro.car_placa);
            else
                setCarro("");
            setCliente(resp.data.cliente.pes_nome);
            if(resp.data.funcionario!==null)
                setFuncionario(resp.data.funcionario.pes_nome);

            else
                setFuncionario("");
            setDescricao(resp.data.ser_descricao);
            setDtInicio(resp.data.ser_inicio);
            setDtFim(resp.data.ser_fim);
            setMaoObra(resp.data.ser_maoObra);
            setStatus(resp.data.ser_status);
            
            setTotal(resp.data.total);
            setPecasUti(resp.data.pecas);
        });
        
    }
    
    function abrirContasReceber(){
        history.push('/listaContasReceberServico');
    }
    function fecharServico(){

        history.push('/fechaServico');
    }
    function voltarHome(){
        localStorage.removeItem('cod_ser');
        history.goBack();
    }
    function mudarEstruturaData(valor){
        if(valor!==null){
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
        return "Não finalizado";
    }
    async function cancelarFechamento(){
        
        btnFecharModal();
      

        await api.put('/cancelarFechamento',{
            ser_cod: localStorage.getItem('cod_ser'),

        }).then((response)=>{
            if(response.data.ser_fim!==null){
                setShowModalAviso(true);
            }
            recuperarServico();
        })
      
        
    }
    async function btnClickCancelarFechamento(){
        setShowModal(true);

    }

    async function btnFecharModal(){
        setShowModal(false);
        setShowModalAviso(false);
    }
    return (
    <div className="background">
        <Header/>
        <div className="div-infoServico">
            <h1>Informações do Serviço</h1>
            <div className="div-infoBasica">
                <p className="p-funcionario"><strong>Funcionário:</strong> {funcionario}</p>
                <p className="p-cliente"><strong>Cliente:</strong> {cliente}</p>
                <p className="p-carro"><strong>Carro:</strong> {carro}</p>
                <p className="p-dtInicio"><strong>Data Inicio:</strong> {mudarEstruturaData(dtInicio)}</p>
                <p className="p-dtFim"><strong>Data Fim:</strong> {mudarEstruturaData(dtFim)}</p>
                <p className="p-descricao"><strong>Descricao:</strong></p>
                <textarea rows="10" cols="110" value={descricao} readOnly>
                </textarea>
                
                
                <p className="p-maoObra"><strong>Mao de obra:</strong>R$ {parseFloat(maoObra).toFixed(2)}</p>
            
                    <table className="tableSerPecas">
                        <thead>
                            <tr>
                                <td>Descrição</td>
                                <td>Quantidade</td>
                                <td>Valor Uni.</td>
                                
                            
                            </tr>
                        </thead>
                        <tbody>
                            {pecsUti.map(pec=>(
                                <tr key={pec.peca.pec_cod}>
                                    <td>{pec.peca.pec_descricao}</td>
                                    <td>{pec.uti_qtde}</td>
                                    <td>R$ {parseFloat(pec.uti_precoUni).toFixed(2)}</td>
                                    
                                
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <p className="p-valorTotal"><strong>Total:</strong>R$ {parseFloat(total).toFixed(2)}</p>
               
                <div className="div-buttons">
                    <button className="button-acao" onClick={()=>fecharServico()} disabled={!status}>Fechar Serviço</button>
                    <button className="button-acao" onClick={()=>btnClickCancelarFechamento()} disabled={status}>Cancelar fechamento de serviço</button>
                    <button className="button-acao" onClick={()=>abrirContasReceber()} disabled={status}>Abrir contas a receber</button>
                </div>
            </div>
            <button className="button-voltar" onClick={voltarHome}>Voltar</button>
        </div>
        {showModal &&
            <div className="modal">
                <div className="modal-content">
                    <div className="modal-content-text"> 
                        <p>Deseja realmente cancelar o fechamento do serviço?</p>
                    </div>
                    <div className="modal-content-btns">
                        <button type="button" className="btn-confirma" onClick={cancelarFechamento}>Confirmar</button>
                        <button type="button" className="btn-cancela" onClick={btnFecharModal}>Fechar</button>
                    </div>
                </div>
            </div>
        }
        {showModalAviso &&
            <div className="modal">
                <div className="modal-content">
                    <div className="modal-content-text"> 
                        <p>Não é possivel cancelar. Pagamento já recebido</p>
                    </div>
                    <div className="modal-content-btns">
                        <button type="button" className="btn-cancela" onClick={btnFecharModal}>Fechar</button>
                    </div>
                </div>
            </div>
        }
    </div>
    );
}

export default VisualizarServiço;