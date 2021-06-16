import api from '../../servicos/api';
import React,{useState,useEffect} from 'react';
import history from '../../history'
import './cadastroDespesa.css'
import '../../app.css'
import Header from '../../Components/Header'

function CadastroDespesa(){
    const [nivel,setNivel] =useState('');

    function gravarDespesa(){

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
                        <input type="text" id="tpDespesa" name="tpDespesas"/>
                    </div>
                    <div className="input-block blockDes-dtLanc">
                        <label>Data de Lançamento:</label>
                        <input type="date" id="dtLancamento" name="dtLancamento"/>
                    </div>
                    <div className="input-block blockDes-dtVenc">
                        <label>Data de Vencimento:</label>
                        <input type="date" id="dtVencimento" name="dtVencimento"/>
                    </div>
                    <div className="input-block blockDes-tpPag">
                        <label>Modo de Pagamento:</label>
                        <label>À vista
                            <input type="radio" id="tpPag" name="tpPag" value="A" checked={nivel==='A'}/>
                        </label>
                        <label>Parcelado
                            <input type="radio" id="tpPag" name="tpPag" value="P" />
                        </label>
                    </div>
                    <div className="input-block blockDes-nParc">
                        <label>Número de Parcelas:</label>
                        <input type="number" id="NParcelas" name="NParcelas"/>
                    </div>
                    <button type="submit" className="buttonSave">Salvar</button>
                </form>
                
            </div> 
            <button type="button" onClick={voltarHome} className="buttonBack">Voltar</button>
        </div>  
    );
}
export default CadastroDespesa;