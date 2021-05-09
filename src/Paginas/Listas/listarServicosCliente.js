import React, { useEffect, useState } from 'react';
import api from '../../servicos/api';
import history from '../../history'
import '../../app.css'
import './listarServicosCliente.css'
import Header from '../../Components/Header'

function ListaServicosCliente()
{
    const [carros,setCarros]=useState([]);
    const [servicos,setServicos]=useState([]);
    const [filtro,setFiltro]=useState('todas');
    const [filtros,setFiltros]=useState([]);
    const [showModal,setShowModal]=useState(false);
    const [serCod,setSerCod] = useState(0);
    useEffect(()=>{
        listarCarros();
    },[]);
    useEffect(()=>{
        var i=0,j=0;
       
        while(i<carros.length){
            j=0;
            while(j<filtros.length && carros[i].car_id!==filtros[j].car_id)
                j++;
            if(j===filtros.length){
       
                const data= {
                    car_id:carros[i].car_id,
                    car_placa:carros[i].car_placa,
                    car_modelo:carros[i].car_modelo
                }
                filtros.push(data);
                setFiltros(filtros);
            }
            i++;
   
        }
        i=0;
    },[carros]);
    useEffect(()=>{
        if(filtro===null || filtro==="todas")
            listarServicos();
        else
        {
           listarServicosCarro(filtro);
        }
    },[filtro]);
    function voltarHome(){
   
        history.goBack();
    }
    async function listarServicos(){
        await api.get(`/servicoCliente/${localStorage.getItem('cod_cli')}`).then((response)=>{
            setServicos(response.data);
        })

    }
    async function listarServicosCarro(cod){
        await api.get(`/servicoCarro/${cod}`).then((response)=>{
            setServicos(response.data);
        })

    }
    async function listarCarros(){
        await api.get(`/carroPes/${localStorage.getItem('cod_cli')}`).then((resp)=>{
            setCarros(resp.data); 
        });

    }
    function getPlaca(carro){
        var i=0;
        if(carro!==null){
            if(carros.length>0){
                while(i<carros.length && carros[i].car_id!==carro.car_id)
                    i++;
                
                return carros[i].car_placa +" - "+carros[i].car_modelo;
            }
        }
        else{
            return "null";
        }
    }
    function getStatus(status){
        if(status===1)
            return 'Em andamento';
        return 'Finalizado'; 
    }
    function acessarServico(cod){
        localStorage.setItem('cod_ser',cod);
        history.push('/cadastroServico');
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

  
    function visualizarServico(cod){
        localStorage.setItem('cod_ser',cod);
        history.push('/visualizarServico');
    }
    async function excluirServico(){
        
        btnFecharModal();
      
     
        api.delete(`/servico/${serCod}`);

        setServicos(servicos.filter(servico=>servico.ser_cod!==serCod));
     
        
    }
    async function btnClickCancelarFechamento(ser_cod){
        setSerCod(ser_cod);
        setShowModal(true);

    }
    async function btnFecharModal(){
        setShowModal(false);

    }
    return (
    <div id="tela" className="background">
        <Header/>
        <div className='filtroCarro'>
            <select id="select-filtro" value={filtro}  onChange={e=>setFiltro(e.target.value)}>
                <option value="todas">
                    Todas
                </option>
                {filtros.map(res=>(
                    <option value={res.car_id} key={res.car_id}>
                        {res.car_placa} - {res.car_modelo}
                    </option>
                ))}
                
            </select>
        </div>
        <div className="table-servicos">   
        <table className='tableSer'>
                <thead>
                    <tr>
                        <td>Carro</td>
                        <td>Data de inicio</td>
                        <td>Status</td>
                        <td>Acao</td>
                    </tr>
                </thead>
                <tbody>
                    {servicos.map(res=>(
                        <tr key={res.ser_cod}>
                            <td>{getPlaca(res.carro)}</td>
                            <td>{mudarEstruturaData(res.ser_inicio)}</td>
                            <td>{getStatus(res.ser_status)}</td>
                            <td>
                            <button onClick={()=>acessarServico(res.ser_cod)} disabled={!res.ser_status} className="button-item">Editar</button>
    
                            <button onClick={()=>visualizarServico(res.ser_cod)} className="button-item">Vizualizar</button>
                            <button onClick={()=>btnClickCancelarFechamento(res.ser_cod)} className="button-item">Excluir</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        
        <button type="button" onClick={voltarHome} className="buttonBack">Voltar</button>
        {showModal &&
            <div className="modal">
                <div className="modal-content">
                    <div className="modal-content-text"> 
                        <p>Deseja realmente excluir serviço?</p>
                    </div>
                    <div className="modal-content-btns">
                        <button type="button" className="btn-confirma" onClick={excluirServico}>Confirmar</button>
                        <button type="button" className="btn-cancela" onClick={btnFecharModal}>Fechar</button>
                    </div>
                </div>
            </div>
        }
    </div>
    );
}

export default ListaServicosCliente;
