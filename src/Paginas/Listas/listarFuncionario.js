import React, { useEffect, useState } from 'react';
import api from '../../servicos/api';
import history from '../../history'
import '../../app.css'
import './listarFuncionario.css'
import './listaClientes.css'
import Header from '../../Components/Header'
import ReactLoading from 'react-loading';
function ListaFuncionarios()
{
    const [pessoas,setPessoas]=useState([]);
    const [filtro,setFiltro] = useState('');
    const [showModal,setShowModal]=useState(false);
    const [loading,setLoading]=useState(false);
    const [codPes,setCodPes] = useState(0);
    useEffect(()=>{
       
    },[]);
    function voltarHome(){

        history.goBack();
    }

    async function listarFuncionarios(){
        await api.get(`/pessoasFun`).then((response)=>{    
            
            setPessoas(response.data.filter(pessoas=>pessoas.pes_cod!=parseInt(localStorage.getItem('cod_user'))));
        
            console.log(pessoas);
        })

    }
    async function listarFuncionarioPorFiltro(){
        setLoading(true);
        if(filtro.length>0){
            await api.get(`/pessoasFunFiltro/${filtro}`).then((response)=>{

                setPessoas(response.data.filter(pessoas=>pessoas.pes_cod!=parseInt(localStorage.getItem('cod_user'))));
            })
        }
        else
            listarFuncionarios();
  
        setLoading(false);
    }
    async function acessarFuncionario(codigo){
        localStorage.setItem('cod_fun',codigo)
        history.push("/cadastroFuncionario");
    }
    async function btnClickExcluir(pesId){
        setCodPes(pesId);
        setShowModal(true);
    }
    async function btnFecharModal(){
        setShowModal(false);
    }
    async function excluirFuncionario(){
        btnFecharModal();
        await api.delete(`/func/${codPes}`);

        setPessoas(pessoas.filter(pessoas=>pessoas.pes_cod!==codPes));
        
    }
    return (
    <div id="tela" className="background">
        <Header/>
        <div className="div-pesquisa">
                <input className="input-pesquisa" value={filtro} onChange={e=>setFiltro(e.target.value)}/>
                <button className="button-pesquisa" onClick={listarFuncionarioPorFiltro} type="button" id="btnForm"></button>
        </div>
        <div className="table-funcionarios">
            <table className='tableFunc'>
                <thead>
                    <tr>
                        <td>CPF</td>
                        <td>Nome</td>
                        <td>Acao</td>
                    </tr>
                </thead>
                <tbody>
                    {!loading && pessoas.map(res=>(
                        <tr key={res.pes_cpf}>
                            <td>{res.pes_cpf}</td>
                            <td>{res.pes_nome}</td>
                            <td>
                            <button onClick={()=>acessarFuncionario(res.pes_cod)} className="button-item">Editar</button>
                            <button onClick={()=>btnClickExcluir(res.pes_cod)} className="button-excluirItem">Excluir</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {loading &&
                <div className="loadingListaFuncionario">
                    <ReactLoading type={"spinningBubbles"} color={"#ffffff"} height={'20%'} width={'20%'} />
                </div>
            }
        </div>
        <button type="button" onClick={voltarHome} className="buttonBack">Voltar</button>
        {showModal &&
            <div className="modal">
                <div className="modal-content">
                    <div className="modal-content-text"> 
                        <p>Deseja excluir o funcionário? O funcionário pode estar sendo utilizado em outros lugares</p>
                    </div>
                    <div className="modal-content-btns">
                        <button type="button" className="btn-confirma" onClick={excluirFuncionario}>Confirmar</button>
                        <button type="button" className="btn-cancela" onClick={btnFecharModal}>Fechar</button>
                    </div>
                </div>
            </div>
        }
    </div>
    );
}

export default ListaFuncionarios;