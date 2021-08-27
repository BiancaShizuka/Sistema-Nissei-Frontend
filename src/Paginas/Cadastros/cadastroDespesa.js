import api from '../../servicos/api';
import React,{useState,useEffect} from 'react';
import history from '../../history'
import './cadastroDespesa.css'
import '../../app.css'
import Header from '../../Components/Header'

function CadastroDespesa(){
    const [valor,setValor]=useState(0);
    const [tpdes,setTpdes] =useState('');
    const [tipos,setTipos]=useState([]);
    const [tipo,setTipo]=useState(0);
    const [disabledQtde,setDisabledQtde]=useState(false);
    const [qtdeParcela,setQtdeParcela]=useState(1);
    const [dtLancamento,setDtLancamento]=useState('');
    useEffect(()=>{
        listarTipoDespesa();
    },[])
    useEffect(()=>{
        if(tpdes==="vista"){
            setDisabledQtde(true);
            setQtdeParcela(1);
           
        }
        else{
            setQtdeParcela(2);
            setDisabledQtde(false);
       
        }
       
          
    },[tpdes,qtdeParcela]);
    async function gravarDespesa(){
        console.log(tipo);
        api.post('/despesa',{
            total: valor,
            des_dtEntrada:dtLancamento,
            td_cod:tipo,
            qtdeParc:qtdeParcela
        });
        setDtLancamento('');
        setValor(0);
        setTpdes("");
    }
    async function listarTipoDespesa(){
        await api.get(`/tipodespesa`).then((response)=>{
            
            setTipos(response.data);
        })
       
    }
  
    function voltarHome(){
        history.goBack();
    }
    return(
        <div className="background">
            <Header/>
            <div className="div-cadDespesas">
                <h1>Cadastro Despesa</h1>
                <form className='form-despesas' onSubmit={gravarDespesa}>
                    <div className="input-block blockDes-tp">
                        <label>Tipo de despesas:</label>
                        <select id="select-tipodespesa" value={tipo} onChange={e=>setTipo(e.target.value)}>
                            <option id="op-selecione" value="">
                                Selecione uma opcao
                            </option>
                            {tipos.map(tipo=>(
                                <option key={tipo.td_cod} value={tipo.td_cod} >
                                    {tipo.td_nome}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="input-block blockDes-dtLanc">
                        <label>Data de Lançamento:</label>
                        <input type="date" id="dtLancamento" name="dtLancamento" value={dtLancamento} onChange={e=>setDtLancamento(e.target.value)}/>
                    </div>
                    <div className="input-block blockDes-dtLanc">
                        <label>Valor:</label>
                        <input type="number" id="valor-despesa" name="valor-despesa" value={valor} onChange={e=>setValor(e.target.value)}/>
                    </div>
                    <div className="input-block blockDes-tpPag">
                    <label>Forma de Pagamento: </label>
                <       select className="select-tpdes" value={tpdes} onChange={e=>setTpdes(e.target.value)}>
                        <option value="vista">
                            À vista
                        </option>
                        <option value="parcelas">
                            Parcelas
                        </option>
                        
                        </select>
                    </div>
                    <div className="input-block blockDes-nParc">
                        <label>Número de Parcelas:</label>
                        <input type="number" id="NParcelas" name="NParcelas" disabled={disabledQtde} min={2} value={qtdeParcela} onChange={e=>setQtdeParcela(e.target.value)}/>
                    </div>
                    <button type="button" onClick={()=>gravarDespesa()} className="buttonSave">Salvar</button>
                </form>
                
            </div> 
            <button type="button" onClick={voltarHome} className="buttonBack">Voltar</button>
        </div>  
    );
}
export default CadastroDespesa;