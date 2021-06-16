import api from '../../servicos/api';
import React,{useState,useEffect} from 'react';
import history from '../../history'
import './cadastroContato.css'
import '../../app.css'
import Header from '../../Components/Header'

function FormularioDespesa(){
    const [nivel,setNivel] =useState('');

    function gravarDespesa(){

    }
    function voltarHome(){

    }
    return(
        <div></div>
        /*
        <div className="background">
            <Header/>
            <div className="div-cadDespesas">
                <form class='form-despesas' onSubmit={gravarDespesa}>
                    <label>Tipo de despesas:</label>
                    <input type="text" id="tpDespesa" name="tpDespesas"/>
                    <label>Data de Lançamento:</label>
                    <input type="date" id="dtLancamento" name="dtLancamento"/>
                    <label>Data de Vencimento:</label>
                    <input type="date" id="dtVencimento" name="dtVencimento/"/>
                    <label>Modo de Pagamento:</label>
                    <input type="radio" id="avista" name="avista" value="A" checked={nivel==='A'}/>
                    <label for="avista">À vista</label>
                    <input type="radio" id="parcelado" name="parcelado" value="P" />
                    <label for="parcelado">Parcelado</label>
                    <label>Número de Parcelas:</label>
                    <input type="number" id="NParcelas" name="NParcelas"/>
                    <button type="submit" class="buttonSave">Salvar</button>
                    <button type="button" onClick={voltarHome} class="buttonBack">Voltar</button>
                </form>
            </div> 
                
        </div>  */ 
    );
}
export default FormularioDespesa;