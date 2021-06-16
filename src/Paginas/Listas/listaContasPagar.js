import React, { useState,useEffect } from 'react';
import api from '../../servicos/api';
import history from '../../history'
import '../../app.css'
import Header from '../../Components/Header'
import './listaContasPagar.css'
import ReactLoading from 'react-loading';
function ListarContasPagar()
{

    return (

        <div id="tela" className="background">
            <Header/>
            <div class="div-despesas">
                <h1>Contas a Pagar</h1>
                <form class="formularioDespesas">
                    <div class="filtro-despesas">
                            <label >Tipo de Despesas: </label>
                            <input type="text"/>
                            <label >Data de Lançamento: </label>
                            <input type="date"/>
                            <label >Data de Vencimento: </label>
                            <input type="date"/>
                            <div className="div-filtrarDespesa">
                                <button className="button-filtrarDespesa">Pesquisar</button>  
                            </div>  
                    </div>    
                    <div className="div-despesasT">
                        <table class='tabelaDes'>
                            <thead>
                                <tr>
                                    <td className="tdD-tipo">Tipo</td>
                                    <td className="tdD-valor">Valor</td>
                                    <td className="tdD-dtLancamento">Data de Lançamento</td>
                                    <td className="tdD-dtVencimento">Data de vencimento</td>
                                    <td className="tdD-dtParcelas">Número de Parcelas</td>
                                    <td className="tdD-tipoPgto">Tipo de Pagamento</td>
                                    <td className="tdD-dtPgto">Data de Pagamento</td>
                                </tr>
                            </thead>
                        </table>
                       
                    </div> 
                </form> 
            </div>
        </div>
       
    );
}

export default ListarContasPagar;