import React, { useState } from 'react';
import api from '../../servicos/api';
import history from '../../history'
import './cadastroMarca.css'
import './cadastroPeca.css'
import '../../app.css'
import Header from '../../Components/Header'
function FormularioPeca()
{
    const [descricao,setDescricao] = useState('');
    const [button,setButton] = useState("Salvar");
    const [codigo,setCodigo] = useState();
    const [pecas,setPecas] = useState([]);
    const [filtro,setFiltro] = useState('');
    const [showModal,setShowModal]=useState(false);
   
    async function listarPecaPorFiltro(){
        
        if(filtro.length>0){
            await api.get(`/pecafiltro/${filtro}`).then((response)=>{
                setPecas(response.data);
            })
        }
        else
            listarPecas();
     

    }
    async function listarPecas(){
        await api.get(`/peca`).then((response)=>{
            setPecas(response.data);
        })

    }
    function voltarHome(){
        history.goBack();
    }

    async function adicionarPeca(e){
        e.preventDefault();
  
        if(button==='Salvar'){
            await api.post('/peca',{
                pec_descricao: descricao,
                
            })
            alert('Peca cadastrada');
       
        }
        else{
            await api.put('/peca',{
                pec_cod: codigo,
                pec_descricao: descricao
            })
            setButton('Salvar');
            
        }
        listarPecaPorFiltro();
        setDescricao('');
    }
    async function btnClickExcluir(pecId){
        setCodigo(pecId);
        setShowModal(true);
    }
    async function btnFecharModal(){
        setShowModal(false);
    }
    async function Excluir()
    {
        btnFecharModal();
        await api.delete(`/peca/${codigo}`);
        setPecas(pecas.filter(pecas=>pecas.pec_cod!==codigo));
    }
    async function Alterar(cod)
    {
        await api.get(`/peca/${cod}`).then((resp)=>{
            setDescricao(resp.data[0].pec_descricao);
            setCodigo(resp.data[0].pec_cod);
        });
        setButton('Alterar');
    }
    return (
    <div className='background'>
        <Header/>
        <div className="div-peca"> 
            <h1>Peças</h1>
            <form className="form-peca" onSubmit={adicionarPeca} >
                <div className="input-block" id="block-descricao">
                    <label htmlFor="descricao">Descrição</label>
                    <input className="input-descricao" id="descricao" value={descricao} onChange={e=>setDescricao(e.target.value)} required/>
          
                </div>
                
                <div id="mensagem">

                </div>
                <button className="button-peca" type="submit" id="btnForm">{button}</button>
            </form>
            <h1 className="titulo-lista">Procurar Peca</h1>
            <div className="div-pesquisa">
                <input className="input-pesquisa" value={filtro} onChange={e=>setFiltro(e.target.value)}/>
                <button className="button-pesquisa" onClick={listarPecaPorFiltro} type="button" id="btnForm"></button>
            </div>
            {pecas.length>0 && <table className='table-marca'>
                <thead>
                    <tr>
                        <td className="td-Codigo">Codigo</td>
                        <td className="td-Descricao">Descricao</td>
                        <td className="td-Acao">Ação</td>
                    </tr>
                </thead>
                <tbody>
                    {pecas.map(peca=>(
                        <tr key={peca.pec_cod}>
                            <td>{peca.pec_cod}</td>
                            <td>{peca.pec_descricao}</td>
                            <td>
                            <button className="button-item" onClick={()=>Alterar(peca.pec_cod)}>Editar</button>
                            <button className="btnExcluirPeca" onClick={()=>btnClickExcluir(peca.pec_cod)}>Excluir</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>}
            <button className="button-voltarPeca" type="button" onClick={voltarHome}>Voltar</button>
        </div>
        {showModal &&
            <div className="modal">
                <div className="modal-content">
                    <div className="modal-content-text"> 
                        <p>Deseja excluir a peça? Ele pode estar sendo utilizado em outros lugares</p>
                    </div>
                    <div className="modal-content-btns">
                        <button type="button" className="btn-confirma" onClick={Excluir}>Confirmar</button>
                        <button type="button" className="btn-cancela" onClick={btnFecharModal}>Fechar</button>
                    </div>
                </div>
            </div>
        }
    </div>
    );
}

export default FormularioPeca;