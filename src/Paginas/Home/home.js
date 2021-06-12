import React, { useEffect, useState } from 'react';
import history from '../../history'
import "./home.css"
import Header from '../../Components/Header'

function Home()
{
    const [isOpen,setIsOpen] = useState(false);
    useEffect(()=>{
      getStatus();
    },[]);
    async function getStatus(){
  
        if(localStorage.getItem('nivel_user')==='A')
            setIsOpen(true);
       

    }
    function cadastrarCliente(){
        history.push('/cadastroCliente');
    }

    function cadastrarFuncionario(){
        history.push('/cadastroFuncionario');
    }

    function listarClientes(){
        history.push('/listaClientes');
    }

    function listarFuncionarios(){
        history.push('/listaFuncionarios');
    }
    function listarServicos(){
        history.push('/listaServicos');
    }

    function cadastrarMarca(){
        history.push('/cadastroMarca');
    }
    function cadastrarPeca(){
        history.push('/cadastroPeca');
    }
    function listarContasReceber(){
        history.push('/listaContasReceber');
    }
    return (
    <div className="background">
        <Header/>
        <div className="div-lists">
            <div className="div-headerList">
                <h1>Cliente e Serviços</h1>
                <div className="list">
                    <button type="button" onClick={cadastrarCliente} className="button-home">Cadastrar Clientes</button>
                    <button type="button" onClick={listarClientes} className="button-home">Listar Clientes</button>

                    <button type="button" onClick={listarServicos} className="button-home">Listar Serviço</button>               
                </div>
            </div>
            {isOpen &&
            <div className="div-headerList">
                <h1>Funcionário</h1>
                <div className="list">
                    <button type="button" onClick={cadastrarFuncionario} className="button-home">Cadastrar Funcionário</button>
                    <button type="button" onClick={listarFuncionarios} className="button-home">Listar Funcionarios</button> 
                    
                </div>
            </div>
            }
            <div className="div-headerList">
                <h1>Contas</h1>
                <div className="list">
                    <button type="button" onClick={listarContasReceber} className="button-home">Listar Contas a Receber</button>
                    
                
                    
                </div>
            </div>
            <div className="div-headerList">
                <h1>Marcas e Peças</h1>
                <div className="list"> 
                    <button type="button" onClick={cadastrarMarca} className="button-home">Marcas de carro</button>
                    <button type="button" onClick={cadastrarPeca} className="button-home">Peças</button>
                    
                </div>
            </div>
        </div>
    </div>
    );
}

export default Home;