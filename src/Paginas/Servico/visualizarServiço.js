import React, { useEffect, useState } from 'react';
import history from '../../history';
import './visualizarServiço.css';
import api from '../../servicos/api';
import Header from '../../Components/Header'
import ReactLoading from 'react-loading';
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

    const [loading,setLoading]=useState(false);
    const [showModal,setShowModal]=useState(false);
    const [showModalAviso,setShowModalAviso]=useState(false);

    
    useEffect(()=>{
        recuperarServico();
        
    },[])
    async function recuperarServico(){
        setLoading(true);
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
            
            setTotal(resp.data.total);
            setPecasUti(resp.data.pecas);
        });
        setLoading(false);
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
    function totalPecas(){
        let total=0;
        for(var i=0;i<pecsUti.length;i++){
            total+=pecsUti[i].total;
        }
        return total;
    }
    async function cancelarFechamento(){
        
        btnFecharModal();
      
        setLoading(true);
        await api.put('/cancelarFechamento',{
            ser_cod: localStorage.getItem('cod_ser'),

        }).then((response)=>{
            if(response.data.ser_fim!==null){
                setShowModalAviso(true);
                setLoading(false);
            }
            else
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
                                <td>Valor</td>
                            
                            </tr>
                        </thead>
                        <tbody>
                            {pecsUti.map(pec=>(
                                <tr key={pec.peca.pec_cod}>
                                    <td>{pec.peca.pec_descricao}</td>
                                    <td>{pec.uti_qtde}</td>
                                    <td>R$ {parseFloat(pec.uti_precoUni).toFixed(2)}</td>
                                    <td>R$ {parseFloat(pec.total).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <p className="p-valorPecasTotal"><strong>Total das peças:</strong>R$ {parseFloat(totalPecas()).toFixed(2)}</p>
                    <p className="p-valorTotal"><strong>Valor do Serviço:</strong>R$ {parseFloat(total).toFixed(2)}</p>
               
                <div className="div-buttons">
                    <button className="button-acao" onClick={()=>fecharServico()} disabled={dtFim!==null || funcionario.length==0 || carro.length==0}>Fechar Serviço</button>
                    <button className="button-acao" onClick={()=>btnClickCancelarFechamento()} disabled={dtFim==null}>Cancelar fechamento de serviço</button>
                    <button className="button-acao" onClick={()=>abrirContasReceber()} disabled={dtFim==null}>Abrir contas a receber</button>
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
        {loading &&
            <div className="modalSer">
                
                <ReactLoading type={"spinningBubbles"} color={"#ffffff"} height={'20%'} width={'20%'} />
            </div>
        }
    </div>
    );
}

export default VisualizarServiço;